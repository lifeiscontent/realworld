import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';

export function FormikSubmitButton(props) {
  const formik = useFormikContext();

  return (
    <button
      {...props}
      disabled={formik.isSubmitting || props.disabled}
      type="submit"
    />
  );
}

FormikSubmitButton.propTypes = {
  disabled: PropTypes.bool
};
