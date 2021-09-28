import React from "react";
import { PageFlow, useEntity } from "zzz-react-components";

import EmailVerification from "../verification/EmailVerification";
import ContactVerification from '../verification/ContactVerification';
import CheckoutOrder from "./CheckoutOrder";
import OnlinePayment from "./OnlinePayment";

const pages = [
  // { name: "verifyemail", caption: "Email Verification", component: EmailVerification },
  // { name: "verification", caption: "Contact Verification", component: ContactVerification },
  { name: "checkout", caption: "Checkout Order", Component: CheckoutOrder },
  { name: "payment", caption: "Online Payment", Component: OnlinePayment }
];


const EPayment =  ({ title, partner }) => {
  return (
    <PageFlow
      name="epayment"
      title={title}
      partner={partner}
      pages={pages}
    />
  );
};

export default EPayment;
