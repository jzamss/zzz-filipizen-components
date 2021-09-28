import React, { useState } from "react";
import {
  Form,
  Card,
  Panel,
  Spacer,
  Button,
  Title,
  Content,
  SubmitButton,
  Text,
  ActionBar,
  currencyFormat,
  MsgBox,
  useEntity,
  Service
} from "zzz-react-components";

const CheckoutOrder = ({ partner, movePrevStep, moveNextStep }) => {
  const [entity, setEntity] = useEntity();
  const [error, setError] = useState();
  const [showMsg, setShowMsg] = useState(false);

  const createPaymentOrder = (bill, form, callback) => {
    setError(null);

    const createPo = async () => {
      const newPo = { ...bill };
      newPo.email = entity.contact.email;
      newPo.mobileno = entity.contact.mobileno;
      let svc = Service.lookupAsync(`${partner.id}:EPaymentService`, "epayment");
      let po = await svc.invoke("createPaymentOrder", newPo);

      const pmtSvc = Service.lookupAsync("CloudPaymentService", "epayment");
      po = await pmtSvc.invoke("getPaymentOrder", { objid: po.objid });
      const payOptions = await pmtSvc.invoke("getPaymentPartnerOptions", {partnerid: po.orgcode});
      return { po, payOptions, partner };
    }

    createPo().then(data => {
      setEntity(draft => {
        draft.po = data.po;
        draft.payOptions = data.payOptions;
        return draft;
      });
      callback();
      moveNextStep();
    }).catch(err => {
      setError(err.toString());
      callback(err.toString());
    });
  };

  return (
    <Form 
      initialEntity={entity.bill} 
      onSubmit={createPaymentOrder}
      render={({values: bill}) => (
        <Card>
          <Panel style={{ maxWidth: 400 }}>
            <Content center>
              <Title>Confirm Transaction</Title>
              <Spacer />
              <label style={{ ...styles.text }}>
                Please confirm and fill up name and address of the payer for your
                electronic official receipt and click Continue to proceed for
                payment.
              </label>
              <Spacer />
            </Content>
            <Panel>
              <Text
                name="paidby"
                caption="Paid By Name"
                required={true}
                autoFocus={true}
              />
              <Text
                name="paidbyaddress"
                caption="Paid By Address"
                required={true}
              />
            </Panel>
            <Spacer />
            <Panel style={styles.infoContainer}>
              <div
                style={{ ...styles.infoContainer, ...{ alignItems: "center" } }}
              >
                <label>Payment Details</label>
                <h4>{bill.particulars}</h4>
              </div>
              <div style={styles.amountContainer}>
                <label style={styles.amount}>
                  Php {currencyFormat(bill.amount)}
                </label>
              </div>
            </Panel>
            <Spacer />
            <MsgBox
              open={showMsg}
              title="Error"
              onAccept={() => setShowMsg(false)}
              msg={`An error was encountered when processing your order. Please try again later or contact LGU for assistance.`}
            />
            <ActionBar>
              <Button variant="text" caption="Back" action={movePrevStep} />
              <SubmitButton caption="Continue" />
            </ActionBar>
          </Panel>
        </Card>
      )} 
    />
  );
};

const styles = {
  text: {
    display: "block",
    textAlign: "center"
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column"
  },
  amountContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #aaa"
  },
  amount: {
    fontSize: 24,
    fontWeight: 800,
    padding: 10
  }
};

export default CheckoutOrder;
