import React from "react";
import { Typography, Fade } from "@material-ui/core";

export interface DefaultFormProps {
  isLoading: boolean;
  error: any;
  success: any;
  message: any;
}

interface FormStatus extends DefaultFormProps {
  classes?: {
    errorMessage?: string;
    successMessage?: string;
  };
}

const FormStatus: React.SFC<FormStatus> = ({
  classes = {},
  error,
  message,
  success,
}) => {
  return (
    <>
      {error && (
        <Fade in={error}>
          <Typography color="secondary" className={classes.errorMessage}>
            {message || "Something is wrong with your input :("}
          </Typography>
        </Fade>
      )}
      {success && (
        <Fade in={success}>
          <Typography className={classes.successMessage}>{message}</Typography>
        </Fade>
      )}
    </>
  );
};

export default FormStatus;
