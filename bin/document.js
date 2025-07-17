#!/usr/bin/env node
const { program }=require('commander')
const glob=require('glob')
const fs=require('fs')
const path=require('path')
const strip=require('strip-comments')
const packageJson=require('../package.json')

program
    .name('00akshatsinha00decomment')
    .description('A CLI tool to remove comments from source code files')
    .version(packageJson.version)
    .usage('[options] <glob...>')
    .option('-w, --write', 'overwrite files in-place')
    .option('-o, --out <dir>', 'write cleaned files to specified directory')
    .argument('<glob...>', 'glob pattern(s) of files to decomment')
    .action((patterns, opts)=>{
        try{
            const files=patterns
                .flatMap(pattern=>{
                    try{
                        return glob.sync(pattern, { nodir: true })
                    }catch(error){
                        console.error(`Error processing pattern "${pattern}": ${error.message}`)
                        return []
                    }
                })
                .filter((file, index, arr)=>arr.indexOf(file)===index)

            if(files.length===0){
                console.log('No files found matching the specified patterns.')
                process.exit(0)
            }

            console.log(`Processing ${files.length} file(s)...`)

            let processedCount=0
            let errorCount=0

            files.forEach(file=>{
                try{
                    const input=fs.readFileSync(file, 'utf8')
                    const cleaned=strip(input)
                    let target

                    if(opts.write){
                        target=file
                    }else if(opts.out){
                        const outputDir=path.resolve(opts.out)
                        const fileName=path.basename(file)
                        target=path.join(outputDir, fileName)

                        if(!fs.existsSync(outputDir)){
                            fs.mkdirSync(outputDir, { recursive: true })
                        }
                    }else{
                        target=null
                    }

                    if(target){
                        fs.writeFileSync(target, cleaned)
                        console.log(`✓ Processed: ${file}`)
                        processedCount++
                    }else{
                        process.stdout.write(cleaned)
                    }
                }catch(error){
                    console.error(`✗ Error processing ${file}: ${error.message}`)
                    errorCount++
                }
            })

            if(opts.write || opts.out){
                console.log(`\nCompleted: ${processedCount} files processed successfully`)
                if(errorCount>0){
                    console.log(`Errors: ${errorCount} files failed to process`)
                }
            }

            process.exit(errorCount>0 ? 1 : 0)
        }catch(error){
            console.error(`Fatal error: ${error.message}`)
            process.exit(1)
        }
    })

program.parse()
