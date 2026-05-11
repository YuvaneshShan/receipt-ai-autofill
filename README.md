# Receipt-to-Form Auto-Fill Web App

A simple AI-powered web app that extracts key information from a receipt image and auto-fills an editable form for user review.

## Objective

This project was built for the AI Intern Assessment. The objective is to allow users to upload a receipt image, use a generative AI model to extract key receipt fields, and display the extracted data in an editable form before submission.

## Features

- Upload receipt image
- Preview uploaded receipt
- Extract receipt details using Gemini AI
- Auto-fill editable form fields
- Allow user to review and edit extracted data
- Submit reviewed receipt data
- Save submitted data in browser localStorage
- Display the latest submitted receipt data after refresh
- Clear saved submitted data

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