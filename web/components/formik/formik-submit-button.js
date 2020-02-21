import React from "react";
import { useFormikContext } from "formik";

export function FormikSubmitButton(props) {
  const formik = useFormikContext();

  return <button disabled={formik.isSubmitting} type="submit" {...props} />;
}
