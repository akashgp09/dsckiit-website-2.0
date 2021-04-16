import puppeteer from 'puppeteer';
import Fuse from 'fuse.js';
import fs from 'fs';

import { baseURL, isHeadless, searchablePages, searchableSelector } from './constants';
interface IScrappedData {
	pageName: string;
	name: string;
	text: string;
}

async function getSearchableInPage(
	page: puppeteer.Page,
	currentSearchablePage: string
): Promise<IScrappedData[]> {
	await page.goto(baseURL + currentSearchablePage);
	const extractedNamesandTexts: Pick<IScrappedData, 'name' | 'text'>[] = await page.$$eval(
		searchableSelector,
		(scontents) =>
			scontents.map((sc) => ({
				name: (sc as HTMLElement).dataset.search ?? '',
				text: (sc as HTMLElement).innerText ?? '',
			}))
	);

	const foundContent: IScrappedData[] = extractedNamesandTexts.map((e) => ({
		...e,
		pageName: currentSearchablePage,
	}));

	return foundContent;
}

function createFiles(scrappedData: IScrappedData[]) {
	const extracted = { scrapped: scrappedData };
	fs.writeFileSync('../cloudfare/src/extracted.json', JSON.stringify(extracted, null, '\t'));

	const indexer = Fuse.createIndex(['name', 'text'], scrappedData);
	fs.writeFileSync('../cloudfare/src/indexed.json', JSON.stringify(indexer.toJSON(), null, '\t'));
}

async function createSearchIndex() {
	const browser = await puppeteer.launch({ headless: isHeadless });
	const page = await browser.newPage();
	await page.goto(baseURL);

	const scrappedData: IScrappedData[] = [];
	for (const s of searchablePages) {
		const found = await getSearchableInPage(page, s);
		scrappedData.push(...found);
	}

	createFiles(scrappedData);

	await browser.close();
}

createSearchIndex();