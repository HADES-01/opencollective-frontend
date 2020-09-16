import React, { useState } from 'react';
import PropTypes from 'prop-types';
import themeGet from '@styled-system/theme-get';
import { Field, Form, Formik } from 'formik';
import { trim } from 'lodash';
import { withRouter } from 'next/router';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import slugify from 'slugify';
import styled from 'styled-components';

import Avatar from './Avatar';
import Container from './Container';
import { Box, Flex } from './Grid';
import StyledButton from './StyledButton';
import StyledCheckbox from './StyledCheckbox';
import StyledHr from './StyledHr';
import StyledInput from './StyledInput';
import StyledInputField from './StyledInputField';
import StyledInputGroup from './StyledInputGroup';
import StyledLink from './StyledLink';
import StyledTag from './StyledTag';
import { H1, P, H4 } from './Text';

const Wrapper = styled(Container)`
  display: flex;
  background-color: #e1e4e6;
`;
const BackButton = styled(StyledButton)`
  color: ${themeGet('colors.black.600')};
  font-size: 14px;
`;

const messages = defineMessages({
  nameLabel: { id: 'createOrg.form.nameLabel', defaultMessage: "What's the name of your organization?" },
  urlLabel: { id: 'createOrg.form.urlLabel', defaultMessage: 'What URL would you like?' },
  websiteLabel: { id: 'createOrg.form.webstiteLabel', defaultMessage: "What's your Organization's website" },
  suggestedLabel: { id: 'createOrg.form.suggestedLabel', defaultMessage: 'Suggested' },
  descriptionLabel: {
    id: 'createOrg.form.descriptionLabel',
    defaultMessage: 'What does your organization do?',
  },
  descriptionHint: {
    id: 'createOrg.form.descriptionHint',
    defaultMessage: 'Write a short description of your Organization (150 characters max)',
  },
  descriptionPlaceholder: {
    id: 'create.org.placeholder',
    defaultMessage: 'Making the world a better place',
  },
  errorName: {
    id: 'createOrg.form.error.name',
    defaultMessage: 'Please use fewer than 50 characters',
  },
  errorDescription: {
    id: 'createOrg.form.error.description',
    defaultMessage: 'Please use fewer than 160 characters',
  },
  errorSlug: {
    id: 'createOrg.form.error.slug',
    defaultMessage: 'Please use fewer than 30 characters',
  },
});

const placeholders = {
  name: 'i.e. Salesforce, Airbnb',
  url: 'airbnb',
  description: 'Making a world a better place',
  website: 'www.airbnb.com',
  username: 'User name',
};

const formatGithubRepoName = repoName => {
  // replaces dash and underscore with space, then capitalises the words
  return repoName.replace(/[-_]/g, ' ').replace(/(?:^|\s)\S/g, words => words.toUpperCase());
};

function CreateOrganizationForm(props) {
  const { intl, error, host, loading, github, router } = props;
  const [tos, setTos] = useState('');

  const submit = values => {
    const { description, name, slug } = values;
    // const { tos, hostTos } = this.state;
    // this.props.onSubmit({ name, description, slug, tos, hostTos });
  };
  const initialValues = {
    name: github ? formatGithubRepoName(github.repo) : '',
    description: '',
    slug: github ? github.repo : '',
  };
  const validate = values => {
    const errors = {};

    if (values.name.length > 50) {
      errors.name = intl.formatMessage(messages.errorName);
    }

    if (values.slug.length > 30) {
      errors.slug = intl.formatMessage(messages.errorSlug);
    }
    if (values.slug !== trim(values.slug, '-')) {
      errors.slug = intl.formatMessage(messages.errorSlugHyphen);
    }

    if (values.description.length > 160) {
      errors.description = intl.formatMessage(messages.errorDescription);
    }

    return errors;
  };
  return (
    <Flex flexDirection="column" m={[3, 0]}>
      <Flex flexDirection="column" m={[3, 0]}>
        <Flex flexDirection="column" my={[2, 4]}>
          <Box textAlign="left" minHeight="32px">
            <BackButton asLink onClick={() => window && window.history.back()}>
              ←&nbsp;
              <FormattedMessage id="Back" defaultMessage="Back" />
            </BackButton>
          </Box>
          <Box mb={[2, 3]}>
            <H1
              fontSize={['20px', '32px']}
              lineHeight={['24px', '36px']}
              fontWeight="bold"
              textAlign="center"
              color="black.900"
            >
              <FormattedMessage id="create.org.title" defaultMessage="Create Organization" />
            </H1>
          </Box>
        </Flex>
      </Flex>
      <Formik validate={validate} initialValues={initialValues} onSubmit={submit} validateOnChange={true}>
        {formik => {
          const { values, handleSubmit, errors, touched, setFieldValue } = formik;
          const handleSlugChange = e => {
            if (!touched.slug) {
              setFieldValue('slug', suggestedSlug(e.target.value));
            }
          };
          return (
            <Form>
              <Container flexDirection="column" justifyContent="center" px={[1, 30, 150]}>
                <Container display="flex" flexDirection={['column', 'row', 'row']}>
                  <Flex
                    flexDirection="column"
                    mx={[1, 10, 15]}
                    width={[320, 350, 376, 476]}
                    justifyContent="space-around"
                  >
                    <H4>
                      <FormattedMessage id="organization.info.headline" defaultMessage="Organization's information" />
                    </H4>
                    <StyledInputField
                      name="name"
                      htmlFor="name"
                      error={touched.name && errors.name}
                      label={intl.formatMessage(messages.nameLabel)}
                      value={values.name}
                      onChange={handleSlugChange}
                      required
                      mt={4}
                      mb={3}
                      data-cy="ccf-form-name"
                    >
                      {inputProps => <Field as={StyledInput} {...inputProps} placeholder={placeholders.name} />}
                    </StyledInputField>
                    <StyledInputField
                      name="slug"
                      htmlFor="slug"
                      error={touched.url && errors.url}
                      label={intl.formatMessage(messages.urlLabel)}
                      value={values.url}
                      required
                      mt={3}
                      mb={2}
                      data-cy="cof-form-url"
                    >
                      {inputProps => (
                        <Field
                          onChange={e => {
                            setFieldValue('slug', e.target.value);
                          }}
                          as={StyledInputGroup}
                          {...inputProps}
                          prepend="opencollective.com/"
                          placeholder={placeholders.url}
                        />
                      )}
                    </StyledInputField>
                    {values.name.length > 0 && !touched.slug && (
                      <P fontSize="10px">{intl.formatMessage(messages.suggestedLabel)}</P>
                    )}
                    <StyledInputField
                      name="description"
                      htmlFor="description"
                      error={touched.description && errors.description}
                      label={intl.formatMessage(messages.descriptionLabel)}
                      value={values.description}
                      required
                      mt={3}
                      mb={2}
                      data-cy="c0f-org-description"
                    >
                      {inputProps => (
                        <Field
                          as={StyledInput}
                          {...inputProps}
                          placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
                        />
                      )}
                    </StyledInputField>
                    <P fontSize="11px">{intl.formatMessage(messages.descriptionHint)}</P>
                    <StyledInputField
                      name="website"
                      htmlFor="website"
                      error={touched.website && errors.website}
                      label={intl.formatMessage(messages.websiteLabel)}
                      value={values.website}
                      required
                      mt={3}
                      mb={2}
                      data-cy="ccf-org-website"
                    >
                      {inputProps => (
                        <Field
                          onChange={e => {
                            setFieldValue('website', e.target.value);
                          }}
                          as={StyledInputGroup}
                          {...inputProps}
                          prepend="http://"
                          placeholder={placeholders.website}
                        />
                      )}
                    </StyledInputField>
                  </Flex>
                  <Flex flexDirection="column" width={[320, 350, 376, 476]} mx={[1, 10, 15]}>
                    <H4>
                      <FormattedMessage id="organization.coadmins.headline" defaultMessage="Administrators" />
                    </H4>
                    <P fontSize="14px" mb={2} lineHeight={2}>
                      <FormattedMessage
                        id="coAdminsDescription"
                        defaultMessage="Organization admins can make changes in the profile and interact with other profiles on behalf of this organization."
                      />
                    </P>
                    <Container border="1px solid #E6E8EB" borderRadius="8px" p={[2, 3]} height={[150, 200]}>
                      <Flex flexDirection="row" alignItems="center">
                        <P fontSize="10px" mb={2}>
                          <FormattedMessage id="inviteAdmin" defaultMessage="INVITE CO-ADMIN" />
                        </P>
                        <StyledHr flex="1" borderStyle="solid" borderColor="black.300" width={[100, 110, 120]} />
                      </Flex>
                      <StyledTag m="4px" variant="rounded-right" maxHeight="none">
                        <Avatar radius={20}></Avatar>
                        Joyce
                      </StyledTag>
                      <StyledInputField
                        name="name"
                        htmlFor="name"
                        error={touched.name && errors.name}
                        value={values.name}
                        required
                        mt={4}
                        mb={3}
                        data-cy="cof-form-username"
                      >
                        {inputProps => <Field as={StyledInput} {...inputProps} placeholder={placeholders.username} />}
                      </StyledInputField>
                    </Container>
                  </Flex>
                </Container>

                <Flex flexDirection="column" my={4} mx={1} width={[320, 450]}>
                  <StyledCheckbox
                    name="tos"
                    label={
                      <FormattedMessage
                        id="createorganization.tos.label"
                        defaultMessage="I verify that I am an authorized representative of this organization and 
                            have the right to act on its behalf."
                      />
                    }
                    required
                    onChange={({ checked }) => {
                      this.setState({ tos: checked });
                    }}
                  />
                  {!router.query.hostTos && host && host.termsUrl && (
                    <StyledCheckbox
                      alignItems="flex-start"
                      name="hostTos"
                      label={
                        <FormattedMessage
                          id="createorganization.hosttos.label"
                          defaultMessage="I verify that I am an authorized representative of this organization and 
                              have the right to act on its behalf."
                        />
                      }
                      required
                      onChange={({ checked }) => {
                        this.setState({ hostTos: checked });
                      }}
                    />
                  )}

                  <Flex justifyContent={['center', 'left']} my={4}>
                    <StyledButton
                      fontSize="13px"
                      minWidth="148px"
                      minHeight="36px"
                      buttonStyle="primary"
                      type="submit"
                      loading={loading}
                      onSubmit={handleSubmit}
                      data-cy="ccf-form-submit"
                    >
                      <FormattedMessage id="organization.create.button" defaultMessage="Create Organization" />
                    </StyledButton>
                  </Flex>
                  <Box textAlign="left" minHeight="24px">
                    <P fontSize="16px" color="black.600" mb={2}>
                      <FormattedMessage
                        id="createOrganization.tos"
                        defaultMessage="By joining, you agree to our Terms of Service and Privacy Policy.
                          Already have an account? "
                      />
                      <StyledLink>Sign in →</StyledLink>
                    </P>
                  </Box>
                </Flex>
              </Container>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
}

CreateOrganizationForm.propTypes = {
  collective: PropTypes.object,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  intl: PropTypes.object.isRequired,
};
export default injectIntl(withRouter(CreateOrganizationForm));
