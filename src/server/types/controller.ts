export type ParamType =
  | "int"
  | "int?"
  | "integer"
  | "number"
  | "date"
  | "dateTime"
  | "id"
  | "boolean"
  | "bool"
  | "bool?"
  | "string"
  | "string?"
  | "email"
  | "password"
  | "object"
  | "object?"
  | "array"
  | "array?"
  | (string | null)[]
  | {
      type: string;
      required?: boolean;
      allowEmpty?: boolean;
      format?: RegExp;
      values?: any[];
      rule?: any;
      rules?: Record<string, any>;
      max?: number;
      min?: number;
      itemType?: string;
    };
