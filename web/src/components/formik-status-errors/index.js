import { useFormikContext } from 'formik';

export function FormikStatusErrors() {
  const formik = useFormikContext();
  return Array.isArray(formik.status) && formik.status.length
    ? formik.status.map(message => <li key={message}>{message}</li>)
    : null;
}
