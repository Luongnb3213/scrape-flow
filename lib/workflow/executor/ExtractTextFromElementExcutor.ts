import { Environment, ExecutionEnvironment } from '@/types/executor';

import { ExtractTextFromElement } from '../task/ExtractTextFromElement';
import * as cheerio from 'cheerio';
export async function ExtractTextFromElementExcutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>
): Promise<boolean> {
  console.log('Page tO  HTML...');
  try {
    const selector = environment.getInput('Selector');
    if (!selector) {
      environment.log.error('Selector is not provided');
      return false;
    }
    const html = environment.getInput('Html');
    if (!html) {
      environment.log.error('Html not found');

      return false;
    }

    const $ = cheerio.load(html);
    const elemet = $(selector);

    if (!elemet) {
      environment.log.error('Element not found');

      return false;
    }

    const extractedText = $.text(elemet);
    if (!extractedText) {
      environment.log.error('Element has no text');

      return false;
    }

    environment.setOutput('Extracted text', extractedText);

    return true;
  } catch (error: any) {
    console.error(error);
    environment.log.error(error.message);

    return false;
  }
}
