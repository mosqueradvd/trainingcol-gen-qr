import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import QRComponent from "./QRComponent";
import Spinner from "./Spinner";
import LoginForm from "../components/LoginForm";

export default function Home() {
  const [username, setUsername]: any = useState("");
  const [password, setPassword]: any = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQRData]: any = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getQR = async (e: any, username: any, password: any) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ username: username, password: password }),
    };

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwgUztsYgTp8TzUUIE68rh2411PGqxyGma6UJVEdwfUWZ1lU3lgjjzgcYrie11c34aC/exec?op=getQR&username=" +
          username +
          "&password=" +
          password,
        options
      );
      const data = await response.json();
      setQRData(data.qrCode);
      if (!data.success) {
        setErrorMessage("Usuario o contraseña incorrectos");
      } else {
        setErrorMessage("");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Ocurrió un error");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Training Net Colombia</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="/"
            className="flex items-center mb-10 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <Image
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="Training Net Colombia"
            />
            Training Net Colombia
          </Link>
          {isLoading ? (
            <Spinner />
          ) : (
            <div>
              {qrData && (
                <QRComponent
                  qrCode={qrData}
                  username={username}
                  password={password}
                />
              )}
              {!qrData && (
                <LoginForm
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  onSubmit={(e: any) => getQR(e, username, password)}
                  errorMessage={errorMessage}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
