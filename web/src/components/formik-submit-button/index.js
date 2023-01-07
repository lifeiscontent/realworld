import { useFormikContext } from 'formik';

export function FormikSubmitButton(props) {
  const formik = useFormikContext();

  return <button {...props} disabled={formik.isSubmitting} type="submit" />;
}
