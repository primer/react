import fs from 'fs/promises';  
import path from 'path';  
import fm from 'front-matter'; // به جای require از import استفاده شده است  

const sourceDirectory = path.resolve(__dirname, '../../docs/content/');  
const outputDir = path.resolve(__dirname, '../../dist/');  

type ComponentStatus = {  
  [component: string]: string;  
};  

/**  
 * Extracts the component status for each file in the given directory.  
 *  
 * @param filenames Array of filenames to read front-matter from  
 * @param dir Absolute path to directory containing files  
 * @returns A promise that resolves to an array containing outcome of file front-matter extraction  
 */  
async function getComponentStatuses(filenames: string[], dir: string): Promise<ComponentStatus[]> {  
  const promises = filenames.map(async (filename) => {  
    try {  
      const content = await fs.readFile(path.resolve(dir, filename), 'utf-8');  

      if (fm.test(content)) {  
        const {  
          attributes: { title, status },  
        } = fm(content);  

        if (status) {  
          return { [title]: status };  
        }  
      }  
    } catch (error) {  
      console.error(`Error reading file ${filename}: ${error}`);  
    }  
    return null; // Return null if not valid  
  });  

  return (await Promise.all(promises)).filter(Boolean) as ComponentStatus[];  
}  

/**  
 * Orchestrates the process of reading component status for each file in the given directory.  
 *  
 * @param dir Directory to source files where status will be extracted from  
 * @returns A promise that resolves to an object containing component statuses  
 */  
async function readFiles(dir: string): Promise<ComponentStatus> {  
  try {  
    const dirContents = await fs.readdir(dir, { withFileTypes: true });  
    const filenames = dirContents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);  

    const componentStatusesArray = await getComponentStatuses(filenames, dir);  

    return componentStatusesArray.reduce((acc, file) => ({  
      ...acc,  
      ...file,  
    }), {});  
  } catch (error) {  
    throw new Error(`Error reading files: ${error}`);  
  }  
}  

/**  
 * Writes the component status to the given file.  
 */  
async function build() {  
  try {  
    const componentStatuses = await readFiles(sourceDirectory);  

    await fs.mkdir(outputDir, { recursive: true });  

    await fs.writeFile(path.join(outputDir, 'component-status.json'), JSON.stringify(componentStatuses));  
  } catch (error) {  
    throw new Error(`Error building component status object: ${error}`);  
  }  
}  

build();
