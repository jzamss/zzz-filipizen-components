import React from "react";
import {
  Text,
  Mobileno,
  Email,
  Service,
  Wizard,
  FormButton,
  useEntity,
  Panel,
} from "zzz-react-components";

import { usePartner } from "../../hooks";

const ContactVerification = ({
  page,
  title = "Contact Verification",
  subtitle = "Email Verification",
  onCancel,
  connection = "epayment",
  visible = true,
  showName = true,
  emailRequired = true,
  moveNextStep
}) => {
  const [_, setEntity] = useEntity();
  const [partner] = usePartner();

  if (!visible) return null;

  const verifyContactInfo = (data, onError, form) => {
    const emailSvc = Service.lookupAsync(`${partner.id}:VerifyEmailService`, connection);
    return emailSvc.invoke("verifyEmail", data.contact, (err, data) => {
      if (err) {
        onError(err);
      } else {
        form.change("hiddenCode", data.key);
        onError();
      }
    });
  };

  const verifyCode = (data, onError) => {
    const { hiddenCode, keycode } = data;
    if (hiddenCode !== keycode) {
      onError("Code is incorrect");
    } else {
      onError();
    }
  };

  const handleSubmit = (entity) => {
    entity.contact.verified = true;
    setEntity(draft => { 
      draft.contact = entity.contact;
      return draft;
    });
    moveNextStep();
  };

  const setIsResendCode = ({data, form}) => {
    const callback = (error) => {
      if (!error) {
        window.alert("New verification code sent");
      }
    };
    verifyContactInfo(data, callback, form);
  };

  return (
    <Wizard
      initialEntity={{
        contact: {},
        hiddenCode: null,
        keycode: null,
        error: null,
        isResendCode: false
      }}
      onSubmit={handleSubmit}
      showErrorDialog={true}
      title={title}
      subtitle={subtitle || (page && page.caption)}
    >
      <Wizard.Page onSubmit={verifyContactInfo} onCancel={onCancel}>
        <Panel style={{ minWidth: 400 }}>
          {showName && (
            <React.Fragment>
              <Text
                caption="Full Name"
                name="contact.name"
                autoFocus={true}
                required={true}
              />
              <Text caption="Address" name="contact.address" required={true} />
            </React.Fragment>
          )}
          <Email
            name="contact.email"
            required={emailRequired}
            autoFocus={!showName}
          />
          <Mobileno name="contact.mobileno" />
        </Panel>
      </Wizard.Page>

      <Wizard.Page onSubmit={verifyCode}>
        <Panel style={{ minWidth: 400 }}>
          <Text
            caption="Email Code"
            placeholder="Enter code sent to your email"
            name="keycode"
            maxLength={6}
            autoFocus={true}
            required={true}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <FormButton
              caption="Resend Code"
              action={(args) => setIsResendCode(args)}
              variant="text"
            />
          </div>
        </Panel>
      </Wizard.Page>
    </Wizard>
  );
};

export default ContactVerification;
