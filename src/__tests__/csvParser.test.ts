import { csvUtils } from '../utils/csvUtils';
import fs from 'fs';

/**
 * This test suite verifies the functionality of the parseCSV function.
 *
 * We test the following scenarios:
 * - Parsing a CSV file with a single row
 * - Parsing a CSV file with multiple rows
 * - Handling an empty CSV file
 * - Handling a CSV file with headers only
 * - Handling a CSV file with fewer columns than headers
 * - Handling a CSV file with extra columns
 */

describe('csvUtils', () => {
    const testFile = 'test.csv';

    afterEach(() => {
        if (fs.existsSync(testFile))
        {
            fs.unlinkSync(testFile);
        }
    });

    //#1 Parsing a CSV file with a single row
    it('Parsing a CSV file with a single row', async () => {
        const data: string = (`Document Type,Account Number,Rental Agreement No,Invoice Date,Company Name,Check Out Date,Check In Date
Tax Invoice,1111111,XYZ123,23/04/2023,AMC ltd,2023-04-28 15:00:00,2023-04-29 10:51:00`);
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);
        // Assert that the result matches the expected output
        expect(result).toEqual([
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '1111111',
                'Rental Agreement No': 'XYZ123',
                'Invoice Date': '23/04/2023',
                'Company Name': 'AMC ltd',
                'Check Out Date': '2023-04-28 15:00:00',
                'Check In Date': '2023-04-29 10:51:00',
            },
        ]);
    });

    //#2 Parsing a CSV file with multiple rows
    it('Parsing a CSV file with multiple rows', async () => {
        const data: string = `Document Type,Account Number,Rental Agreement No,Invoice Date,Company Name,Check Out Date,Check In Date
Tax Invoice,1111111,XYZ123,23/04/2023,AMC ltd,2023-04-28 15:00:00,2023-04-29 10:51:00
Tax Invoice,2222222,XYZ345,24/04/2024,AMC ltd,2024-04-28 15:00:00,2024-04-29 10:52:00
Tax Invoice,3333333,XYZ567,21/04/2024,AMC ltd,2024-04-04 15:00:00,2024-04-05 10:53:00`;
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);

        expect(result).toEqual([
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '1111111',
                'Rental Agreement No': 'XYZ123',
                'Invoice Date': '23/04/2023',
                'Company Name': 'AMC ltd',
                'Check Out Date': '2023-04-28 15:00:00',
                'Check In Date': '2023-04-29 10:51:00',
            },
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '2222222',
                'Rental Agreement No': 'XYZ345',
                'Invoice Date': '24/04/2024',
                'Company Name': 'AMC ltd',
                'Check Out Date': '2024-04-28 15:00:00',
                'Check In Date': '2024-04-29 10:52:00',
            },
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '3333333',
                'Rental Agreement No': 'XYZ567',
                'Invoice Date': '21/04/2024',
                'Company Name': 'AMC ltd',
                'Check Out Date': '2024-04-04 15:00:00',
                'Check In Date': '2024-04-05 10:53:00',
            },
        ]);
    });

    //#3 Handling an empty CSV file
    it('Handling an empty CSV file', async () => {
        const data: string = ``;
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);
        expect(result).toEqual([]);
    });

    //#4 Handling a CSV file with headers only
    it('Handling a CSV file with headers only', async () => {
        const data: string = `Document Type,Account Number,Rental Agreement No,Invoice Date,Company Name,Check Out Date,Check In Date`;
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);
        expect(result).toEqual([]);
    });

    //#5 Handling a CSV file with fewer columns than headers
    it('Handling a CSV file with fewer columns than headers', async () => {
        const data: string = `Document Type,Account Number,Rental Agreement No,Invoice Date,Company Name,Check Out Date,Check In Date
Tax Invoice`;
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);

        expect(result).toEqual([
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '',
                'Rental Agreement No': '',
                'Invoice Date': '',
                'Company Name': '',
                'Check Out Date': '',
                'Check In Date': '',
            },
        ]);
    });

    //#6 Handling a CSV file with extra columns
    it('Handling a CSV file with extra columns', async () => {
        const data: string = `Document Type,Account Number,Rental Agreement No,Invoice Date,Company Name,Check Out Date,Check In Date
Tax Invoice,1111111,XYZ123,23/04/2023,AMC ltd,2023-04-28 15:00:00,2023-04-29 10:51:00,Extra`;
        fs.writeFileSync(testFile, data);
        const result = await csvUtils(testFile);
        expect(result).toEqual([
            {
                'Document Type': 'Tax Invoice',
                'Account Number': '1111111',
                'Rental Agreement No': 'XYZ123',
                'Invoice Date': '23/04/2023',
                'Company Name': 'AMC ltd',
                'Check Out Date': '2023-04-28 15:00:00',
                'Check In Date': '2023-04-29 10:51:00',
            },
        ]);
    });
});
