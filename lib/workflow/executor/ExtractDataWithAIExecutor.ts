import { Environment, ExecutionEnvironment } from '@/types/executor';
import { ExtractDataWithAITask } from '../task/ExtractDataWithAITask';
import { prisma } from '@/lib/prisma';
import { symmetricDecrypt } from '@/lib/encryption';
import OpenAI from 'openai';
export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  console.log('Fill Input');
  try {
    const Credentials = environment.getInput('Credentials');
    if (!Credentials) {
      environment.log.error('input->Credentials is not defined');
    }

    const prompt = environment.getInput('Prompt');
    if (!prompt) {
      environment.log.error('input->Prompt is not defined');
    }
    const content = environment.getInput('Content');
    if (!content) {
      environment.log.error('input->Content is not defined');
    }

    const credential = await prisma.credential.findUnique({
      where: {
        id: Credentials,
      },
    });

    if (!credential) {
      environment.log.error('credentials not found');
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error('Can not decrypt credentials');
      return false;
    }

    // let testResult = {
    //   usernameSelector: '#username',
    //   passwordSelector: '#password',
    //   loginSelector: 'body > div > form > input.btn.btn-primary',
    // };



    const openai = new OpenAI({
      apiKey: plainCredentialValue,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a webscraper helper that extracts data from HTML or text.
             You will be given a piece of text or HTML content as input and also the prompt 
             with the data you want to extract. The response should always be only the extracted data 
             as a JSON array or object, without any additional words or explanations. Analyze the input 
             carefully and extract data precisely based on the prompt. If no data is found, return an empty 
             JSON array. Work only with the provided content and ensure the output is always a valid JSON array 
             without any surrounding text`,
        },
        {
          role: 'user',
          content: content,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 1,
    });

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completition tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error('Empty response from AI');
      return false;
    }

    environment.setOutput('Extracted data', JSON.stringify(result));
   return true;

   
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
