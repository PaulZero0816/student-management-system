import { useEffect, useMemo, useReducer } from 'react';
import LRU from 'lru-cache';
import { ApiError } from '../../api/base_api';

export type HookOptions = {
  disableCache?: boolean;
  swr?: boolean;
};

type UseHookType<K, R> = (
  params: K | undefined,
  hookOptions?: HookOptions,
) => [
    // api response
    R | undefined,
    // loading
    boolean,
    // api error
    ApiError | undefined,
    // for api refresh
    (swr?: boolean) => void,
  ];

const convertParamsToKey = <T>(params: T): string | number | undefined => {
  const paramsType = typeof params;
  // @ts-ignore params type is correct, typescript can't figure this out
  return paramsType === 'string' || paramsType === 'number' || paramsType === 'undefined'
    ? params
    : JSON.stringify(params);
};

type ApiHookState<R> = {
  data?: R;
  isLoading: boolean;
  error?: ApiError;
};

type ApiHookAction<R> =
  | { type: 'SET_LOADING' }
  | { type: 'SET_RESPONSE'; response: R }
  | { type: 'SET_FAILURE'; error: ApiError };

type RefreshParams<K, R> = {
  /**
   * The keys(params) you wish to revalidate and refresh
   * @option K              : single key(param) to refresh
   * @option K[]            : array of keys(params) to refresh
   * @option 'refresh-all'  : refresh all keys(params) exist in cache
   */
  keys: K[] | K | 'refresh-all';
  /**
   * stand for "stale-while-revalidate", keep a stale data in place while re-fetch for new data
   * @option true     : you want "stale-while-revalidate", stale data use existing cache data while refresh for new data
   * @option {value}  : you want "stale-while-revalidate", stale data use your given new data
   * @option false    : you do not want "stale-while-revalidate", fallback to loading state during re-fetch for new data
   */
  swr?: boolean | R;
};

type RefreshMethod<K, R> = (params: RefreshParams<K, R>) => Promise<void>;

const fetchHookFactory = <K, R>(
  fetchMethod: (params: K) => Promise<R>,
  cacheOptions?: LRU.Options<string | number, Promise<R>>,
): [UseHookType<K, R>, RefreshMethod<K, R>] => {
  const noCache = !cacheOptions;
  // if cache option is not passed, do not create LRU cache
  const cache = noCache ? undefined : new LRU<string | number, Promise<R>>(cacheOptions);
  // for each fetchHook, create a refreshListener that keeps track of all the listeners inside hooks
  const refreshListeners: RefreshMethod<K, R>[] = [];

  const subscribeListener = (newListener: RefreshMethod<K, R>) => {
    refreshListeners.push(newListener);
    // return method to unsubscribe;
    return () => {
      const listenerIndex = refreshListeners.indexOf(newListener);
      if (listenerIndex >= 0) {
        refreshListeners.splice(listenerIndex, 1);
      }
    };
  };

  const triggerRefreshListener = async (params: RefreshParams<K, R>) => {
    await Promise.all(refreshListeners.map(listener => listener(params)));
  };

  const useApiHook: UseHookType<K, R> = (params, hookOptions) => {
    const disableCache = noCache || hookOptions?.disableCache;
    const [state, dispatch] = useReducer(
      (state: ApiHookState<R>, action: ApiHookAction<R>) => {
        switch (action.type) {
          case 'SET_LOADING':
            return {
              data: undefined,
              error: undefined,
              isLoading: true,
            };
          case 'SET_RESPONSE':
            return {
              data: action.response,
              error: undefined,
              isLoading: false,
            };
          case 'SET_FAILURE':
            return {
              data: undefined,
              error: action.error,
              isLoading: false,
            };
          default:
            return state;
        }
      },
      { isLoading: false, data: undefined, error: undefined },
    );

    const cacheKey = useMemo(() => (disableCache ? 'no-cache' : convertParamsToKey(params)), [
      disableCache,
      params,
    ]);

    useEffect(() => {
      let isMount = true;

      const coreFetch = async (swr?: boolean | R, forceRefresh?: boolean) => {
        if (params) {
          // if silent, do not set loading, keep existing data and replace silently
          if (!swr) {
            // if swr is false or undefined, or there is no existing data
            isMount && dispatch({ type: 'SET_LOADING' });
          } else if (swr !== true) {
            // if we have swr to be a new temp data
            // TODO support swr to be function that take in existing data
            isMount && dispatch({ type: 'SET_RESPONSE', response: swr });
          }
          try {
            const fetchPromise =
              (!disableCache && !forceRefresh && cache?.get(cacheKey!)) || fetchMethod(params!);
            // optimistic, update cache first
            if (!disableCache && !cache?.get(cacheKey!)) {
              cache?.set(cacheKey!, fetchPromise);
            }
            const apiResponse = await fetchPromise;
            isMount && dispatch({ type: 'SET_RESPONSE', response: apiResponse });
          } catch (error) {
            isMount && dispatch({ type: 'SET_FAILURE', error });
            // remove cache on failure
            cache?.del(cacheKey!);
          }
        }
      };
      coreFetch(hookOptions?.swr);

      const unsubscribeRefresh = subscribeListener(async (params: RefreshParams<K, R>) => {
        const { keys, swr } = params;
        // if keys = 'refresh-all', no question asked, refresh all
        if (keys === 'refresh-all') {
          await coreFetch(swr);
          return;
        }
        // otherwise only refresh when our cacheKey is in keys[] or = keys
        if (
          cacheKey && Array.isArray(keys)
            ? keys.map(_ => convertParamsToKey(_)).includes(cacheKey)
            : convertParamsToKey(keys) === cacheKey
        ) {
          cache?.del(cacheKey!);
          await coreFetch(swr);
          return;
        }
      });
      // unsubscribe after component unmounts, and unset isMount
      return () => {
        isMount = false;
        unsubscribeRefresh();
      };
      // React does not deep compare deps, so this could trigger infinite loops
      // If params change, cacheKey will change, we are confident here
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey, disableCache]);

    return [
      state.data,
      state.isLoading,
      state.error,
      (swr?: boolean) => params && triggerRefreshListener({ keys: params, swr }),
    ];
  };

  return [
    useApiHook,
    (refreshParams: RefreshParams<K, R>) => {
      const { keys } = refreshParams;
      // reset cache based on the key type
      if (keys === 'refresh-all') {
        cache?.reset();
      } else if (Array.isArray(keys)) {
        const cacheKeys = keys.map(key => convertParamsToKey(key)!);
        cacheKeys.forEach(cacheKey => {
          cache?.del(cacheKey);
        });
      } else {
        const cacheKey = convertParamsToKey(keys)!;
        cache?.del(cacheKey);
      }
      // refresh existing components in the ui
      return triggerRefreshListener(refreshParams);
    },
  ];
};

export default fetchHookFactory;
