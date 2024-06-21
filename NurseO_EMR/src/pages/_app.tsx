import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import 'react-pure-modal/dist/react-pure-modal.min.css';

import { GlobalContext } from "~/Services/State";
import { useState } from "react";
import { PatientChart } from "@nurse-o-core/index";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  const [studentId, setStudentId] = useState("")
  const [patient, setPatient] = useState<PatientChart>(new PatientChart())
  const [locationId, setLocationId] = useState(12)

  return (
    <SessionProvider session={session}>
      <GlobalContext.Provider value={{ studentId, setStudentId, patient, setPatient, locationId, setLocationId }}>
        <div id="topLevel" className={`standard ` + GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </GlobalContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
