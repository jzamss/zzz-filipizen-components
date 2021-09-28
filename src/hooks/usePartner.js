import { useContext } from "react";
import PartnerContext from "../contexts/PartnerContext";

const usePartner = () => {
  return useContext(PartnerContext);
};

export default usePartner;
