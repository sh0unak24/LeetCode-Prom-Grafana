import axios from "axios";

const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";

export const createJudge0Submission = async (
  sourceCode: string,
  languageId: number
) => {
  const res = await axios.post(`${JUDGE0_URL}/submissions`, {
    source_code: sourceCode,
    language_id: languageId,
    stdin: "",
  });

  return res.data.token as string;
};

export const getJudge0Result = async (token: string) => {
  const res = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
    params: {
      base64_encoded: false,
      wait: false,
    },
  });

  return res.data;
};