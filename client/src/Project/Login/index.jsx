import React from 'react';
import PropTypes from 'prop-types';

import toast from 'shared/utils/toast';
import api from 'shared/utils/api';
import { Form } from 'shared/components';
import { storeAuthToken } from 'shared/utils/authToken';

import { FormHeading, FormElement, Actions, ActionButton } from './Styles';

const propTypes = {
  modalClose: PropTypes.func.isRequired,
};

let isLoggingIn = false;

const Login = ({ modalClose }) => {
  isLoggingIn = false;

  return (
    <Form
      initialValues={{
        email: '',
        password: '',
      }}
      validations={{
        email: [Form.is.required(), Form.is.maxLength(200)],
        password: [Form.is.required(), Form.is.maxLength(200)],
      }}
      onSubmit={async (values, form) => {
        isLoggingIn = true;

        try {
          const { authToken } = await api.post('/authentication/login', values);

          storeAuthToken(authToken);

          toast.success('Successfully logged in!');
          modalClose();

          window.location.reload();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <FormHeading>Project Tracker Login</FormHeading>
        <Form.Field.Input name="email" type="email" label="Email" />
        <Form.Field.Input name="password" type="password" label="Password" />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isLoggingIn}>
            Login
          </ActionButton>
          <ActionButton type="button" variant="empty" onClick={modalClose}>
            Cancel
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

Login.propTypes = propTypes;

export default Login;
