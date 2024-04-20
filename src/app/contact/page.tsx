"use client";
import React, { useState } from "react";
import "./page.css";
import { string, z } from "zod";

interface FormData {
  name: string;
  email: string;
  number: string;
  message: string;
}

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  number: z.string().length(10),
  message: z.string().min(5),
});

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [fieldName: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "number" && value.length > 10) {
      return;
    }
    console.log("Input changed:", name, value); // Débogage
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      console.log("Formulaire soumis :", formData);
      setSubmittedData(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Erreurs de validation :", error.errors);
        setErrors(
          error.errors.reduce<{ [fieldName: string]: string }>((acc, curr) => {
            return {
              ...acc,
              [curr.path[0]]: curr.message,
            };
          }, {})
        );
      }
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-content">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            className="input"
            type="text"
            id="name"
            name="name"
            placeholder="Insert your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            type="email"
            id="email"
            name="email"
            placeholder="Insert your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label className="label" htmlFor="number">
            Number
          </label>
          <input
            className="input"
            type="number"
            id="number"
            name="number"
            placeholder="Insert your number"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <label className="label" htmlFor="message">
            Message
          </label>
          <input
            className="input"
            type="text"
            id="message"
            name="message"
            placeholder="Insert your message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button className="button" type="submit">
          Send
        </button>
      </form>
      {submittedData && (
        <div className="submitted-data">
          <h2 className="h2-submitted">Submitted Data</h2>
          <p>
            {" "}
            <span className="span-submitted">Name:</span> {submittedData.name}
          </p>
          <p>
            {" "}
            <span className="span-submitted">Email: </span>{" "}
            {submittedData.email}
          </p>
          <p>
            {" "}
            <span className="span-submitted">Number:</span>{" "}
            {submittedData.number}
          </p>
          <p>
            {" "}
            <span className="span-submitted">Message: </span>{" "}
            {submittedData.message}
          </p>
        </div>
      )}
    </div>
  );
}
