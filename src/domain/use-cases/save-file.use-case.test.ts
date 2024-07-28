import fs from 'fs';
import { SaveFile } from './save-file.use-case';

describe('SaveFileUseCAse', () => {
    const customOptions = {
        fileContent: 'custom content',
        fileDestination: 'custom-outputs/file-destination',
        fileName: 'custom-table-name'
    }
    const customFilePath = `${ customOptions.fileDestination }/${ customOptions.fileName }.txt`;

    afterEach(() => {
        const outputFolderExists = fs.existsSync('outputs');
        if (outputFolderExists) fs.rmSync('outputs', { recursive: true });

        const customOutputDirname = customOptions.fileDestination.split('/')[0];
        const customOutputFolderExists = fs.existsSync(customOutputDirname);
        if (customOutputFolderExists) fs.rmSync(customOutputDirname, { recursive: true });
    });    

    test('should save file with default values', () => {
        const saveFile = new SaveFile();
        const filePath = 'outputs/table.txt';
        const options = {
            fileContent: 'test content'
        }

        const result = saveFile.execute(options);
        const fileExists = fs.existsSync(filePath);
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
        
        expect(fileExists).toBe(true);
        expect(fileContent).toBe(options.fileContent);
        expect(result).toBe(true);
    });

    test('should save file with custom values', () => {
        const saveFile = new SaveFile();
        const result = saveFile.execute(customOptions);
        const fileExist = fs.existsSync(customFilePath);
        const fileContent = fs.readFileSync(customFilePath, { encoding: 'utf-8' });

        expect(fileExist).toBe(true);
        expect(fileContent).toBe(customOptions.fileContent);
        expect(result).toBe(true);
    });

    test('should return false if directory could not be created', () => {
       const saveFile = new SaveFile();
       const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(
        () => { throw new Error('This is a custom error message from testing') }
       );
       const result = saveFile.execute(customOptions);
       expect(result).toBe(false);
       mkdirSpy.mockRestore();
    });

    test('should return false if file could not be created', () => {
        const saveFile = new SaveFile();
        const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(
         () => { throw new Error('This is a custom writing error message') }
        );
        const result = saveFile.execute({ fileContent: 'hola' });
        expect(result).toBe(false);
        writeFileSpy.mockRestore();
    });
});