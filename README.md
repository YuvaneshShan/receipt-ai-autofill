# Receipt-to-Form Auto-Fill Web App

A simple AI-powered web app that extracts key information from a receipt image and auto-fills an editable form.

## Objective

This project was built for the AI Intern Assessment. The goal is to upload a receipt image, use a generative AI API to extract important receipt fields, and display the extracted data in a form that users can review and edit before submission.

## Features

- Upload receipt image
- Preview uploaded receipt
- Extract receipt data using Gemini AI
- Auto-fill editable form
- Review and edit extracted data
- Submit reviewed receipt data
- Display submitted data on the page

## Fields Extracted

- Merchant name
- Date
- Total amount
- Currency

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Gemini API
- Vercel

## Model Used

Gemini 2.5 Flash

## Prompt Used

```text
You are an AI receipt extraction assistant.

Extract these fields from the receipt image:
- merchantName
- date
- totalAmount
- currency

Rules:
1. Return only valid JSON.
2. Do not include markdown.
3. Do not include explanation.
4. If a field is missing, use an empty string.
5. Use this exact JSON structure:

{
  "merchantName": "",
  "date": "",
  "totalAmount": "",
  "currency": ""
}