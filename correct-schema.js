const fs = require('fs');
const path = require('path');

// Path to the schemas.json file
const schemaFilePath = path.join(__dirname, 'src/routes/schemas.json');

// Function to fix the schema
const fixSchema = (schema) => {
    // Replace all occurrences of "#/definitions" with "#/components/schemas"
    const jsonString = JSON.stringify(schema);
    const fixedString = jsonString.replace(/#\/definitions/g, '#/components/schemas');

    return JSON.parse(fixedString);
};

// Function to read, fix, and write back the schema
const updateSchemaFile = () => {
    try {
        // Read the existing schemas file
        if (fs.existsSync(schemaFilePath)) {
            const data = fs.readFileSync(schemaFilePath, 'utf8');
            const schema = JSON.parse(data);

            // Fix the schema by replacing "#/definitions" with "#/components/schemas"
            const fixedSchema = fixSchema(schema);

            // Write the corrected schema back to the file
            fs.writeFileSync(schemaFilePath, JSON.stringify(fixedSchema, null, 2));

            console.log('Schema corrected successfully!');
        } else {
            console.error('Schema file does not exist!');
        }
    } catch (error) {
        console.error('Error correcting schema:', error);
    }
};

// Run the script to fix the schema
updateSchemaFile();
