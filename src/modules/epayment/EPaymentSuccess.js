import React from "react";
import {
  Form,
  Panel,
  Button,
  Card,
  Content,
  CardActions,
  Image,
  Label,
  getUrlParameter,
  Text,
  currencyFormat,
  Subtitle,
  Spacer,
} from "zzz-react-components";

const EPaymentSuccess = ({partner, history, location}) => {
  const payment = {
    orgcode: getUrlParameter(location, "orgcode"),
    paymentrefid: getUrlParameter(location, "paymentrefid"),
    txnno: getUrlParameter(location, "txnno"),
    txndate: getUrlParameter(location, "txndate"),
    amount: getUrlParameter(location, "amount"),
    paypartnerid: getUrlParameter(location, "paypartnerid"),
    paidby: getUrlParameter(location, "paidby"),
    email: getUrlParameter(location, "email"),
  }

  const onClose = () => {
    if (partner && partner.name) {
      history.replace(`/partner/${partner.name}/services`, {partner});
    } else {
      history.replace("/partners");
    }
  };

  let contacts = [];
  if (partner.phoneno) {
    contacts.push(`For inquiries, contact us on ${partner.phoneno}`);
  }
  if (partner.email) {
    contacts.push(contacts.length > 1 ? `or email to ${partner.email}` : `For inquiries, email us on ${partner.email}`);
  }
  if (contacts.length == 0) {
    contacts.push("kindly contact the Treasurer's Office.");
  }

  return (
      <Card>
        <Content center>
          <Image src="/assets/success.png" width={60} alt="success" />
          <Subtitle style={{fontSize: 24}}>Payment Successful</Subtitle>
          <Form initialEntity={payment}>
            <Panel style={styles.paymentInfoContainer}>
              <Text caption="Transaction #" name="txnno" readOnly={true} />
              <Text caption="Payment Date #" name="txndate" readOnly={true} />
              <Panel style={styles.amountContainer}>
                <label style={styles.amount}>Amount</label>
                <label style={styles.amount}>PHP {currencyFormat(payment.amount)}</label>
              </Panel>
              <Panel center>
                <label style={{fontSize: 10, marginTop: 10}}>Payment Partner</label>
                <Image
                  src={`/assets/${payment.paypartnerid}.png`} width={150} />
                <Image />
              </Panel>
            </Panel>
          </Form>
          <Label style={{ ...styles.text, ...{ maxWidth: 300 } }}>
            Your e-receipt and tickets will be sent to your email at {payment.email}
          </Label>
          <Label labelStyle={styles.text}>
            Thank you for using this service
          </Label>
          {contacts.length > 0 &&
            <Label labelStyle={styles.text}>
              {contacts.join(" ")}
            </Label>
          }
          <CardActions>
            <Button caption="Return" action={onClose} />
          </CardActions>
          <Spacer />
        </Content>
      </Card>
  );
};

const styles = {
  text: {
    display: "block",
    textAlign: "center",
    width: 300
  },
  paymentInfoContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
    border: "1px solid #aaa",
    borderRadius: 5,
    width: 300,
  },
  amountContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #aaa"
  },
  amount: {
    fontWeight: 800
  }
};

export default EPaymentSuccess;
