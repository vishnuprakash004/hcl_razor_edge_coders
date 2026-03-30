const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    let full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else if (full.endsWith('.java')) {
      files.push(full);
    }
  });
  return files;
}

const entityDir = path.join(__dirname, 'src/main/java/com/foodiehub/entity');
const dtoDir = path.join(__dirname, 'src/main/java/com/foodiehub/dto');
const srcDir = path.join(__dirname, 'src/main/java/com/foodiehub');

function getGettersSettersFor(fields) {
  let s = '';
  for (let f of fields) {
    let Name = f.name.charAt(0).toUpperCase() + f.name.slice(1);
    let getterName;
    let setterName;
    if (f.type === 'boolean' || f.type === 'Boolean') {
        if (f.name.startsWith('is')) {
            getterName = f.name; // isAvailable
            setterName = 'set' + f.name.charAt(2).toUpperCase() + f.name.slice(3); // setAvailable
        } else {
            getterName = 'is' + Name;
            setterName = 'set' + Name;
        }
    } else {
        getterName = 'get' + Name;
        setterName = 'set' + Name;
    }
    s += `\n    public ${f.type} ${getterName}() { return this.${f.name}; }\n`;
    s += `    public void ${setterName}(${f.type} ${f.name}) { this.${f.name} = ${f.name}; }\n`;
  }
  return s;
}

function getBuilderFor(className, fields) {
  let s = `\n    public static ${className}Builder builder() { return new ${className}Builder(); }\n`;
  s += `    public static class ${className}Builder {\n`;
  for (let f of fields) {
    s += `        private ${f.type} ${f.name};\n`;
  }
  for (let f of fields) {
    s += `        public ${className}Builder ${f.name}(${f.type} ${f.name}) { this.${f.name} = ${f.name}; return this; }\n`;
  }
  let args = fields.map(f => `this.${f.name}`).join(', ');
  s += `        public ${className} build() { return new ${className}(${args}); }\n`;
  s += `    }\n`;
  return s;
}

function processEntity(f) {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('lombok')) return;
  
  let className = path.basename(f, '.java');
  
  let hasData = content.includes('@Data');
  let hasGetter = content.includes('@Getter');
  let hasSetter = content.includes('@Setter');
  let hasNoArgs = content.includes('@NoArgsConstructor');
  let hasAllArgs = content.includes('@AllArgsConstructor');
  let hasBuilder = content.includes('@Builder');
  
  // Remove lombok imports
  content = content.replace(/^import\s+lombok\..*;\s*$/gm, '');
  
  // Remove class annotations
  content = content.replace(/@(Data|Getter|Setter|Builder|NoArgsConstructor|AllArgsConstructor)\b\s*/g, '');
  // Remove @Builder.Default entirely and just leave the assignment
  content = content.replace(/^\s*@Builder\.Default\s*$/gm, '');
  
  let rxFields = /^\s*private\s+(?!static|final)(\w+(?:<[^>]+>)?(?:\[\])?)\s+(\w+)(?:\s*=[^;]+)?\s*;/gm;
  let fields = [];
  let match;
  while ((match = rxFields.exec(content)) !== null) {
    fields.push({ type: match[1], name: match[2] });
  }

  let additions = '';

  if (hasNoArgs || hasData) {
    additions += `\n    public ${className}() {}\n`;
  }
  if (hasAllArgs || hasBuilder) {
    let args = fields.map(f => `${f.type} ${f.name}`).join(', ');
    let assigns = fields.map(f => `        this.${f.name} = ${f.name};`).join('\n');
    additions += `\n    public ${className}(${args}) {\n${assigns}\n    }\n`;
  }
  
  if (hasData || hasGetter || hasSetter) {
    additions += getGettersSettersFor(fields);
  }
  
  if (hasBuilder) {
    additions += getBuilderFor(className, fields);
  }
  
  let lastBrace = content.lastIndexOf('}');
  if (lastBrace > -1 && additions) {
    content = content.substring(0, lastBrace) + additions + content.substring(lastBrace);
  }
  
  fs.writeFileSync(f, content, 'utf8');
}

function processInnerClasses(f) {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('lombok')) return;

  // For DTOs which have inner static classes like Request/Response
  content = content.replace(/^import\s+lombok\..*;\s*$/gm, '');
  content = content.replace(/@(Data|Builder|NoArgsConstructor|AllArgsConstructor)\b\s*/g, '');
  content = content.replace(/^\s*@Builder\.Default\s*$/gm, '');

  let innerClasses = [...content.matchAll(/public\s+static\s+class\s+(\w+)\s*{([^}]*?)}/g)];
  for (let c of innerClasses) {
    let orig = c[0];
    let className = c[1];
    let body = c[2];
    
    let hasData = orig.includes('@Data');
    let hasBuilder = orig.includes('@Builder');
    let hasNoArgs = orig.includes('@NoArgsConstructor');
    let hasAllArgs = orig.includes('@AllArgsConstructor');
    let replacedBody = body.replace(/@(Data|Builder|NoArgsConstructor|AllArgsConstructor)\b\s*/g, '');
    replacedBody = replacedBody.replace(/^\s*@Builder\.Default\s*$/gm, '');
    
    let rxFields = /^\s*private\s+(?!static|final)(\w+(?:<[^>]+>)?(?:\[\])?)\s+(\w+)(?:\s*=[^;]+)?\s*;/gm;
    let fields = [];
    let match;
    while ((match = rxFields.exec(replacedBody)) !== null) {
      fields.push({ type: match[1], name: match[2] });
    }

    let additions = '';
    if (hasNoArgs || hasData) additions += `\n        public ${className}() {}\n`;
    if (hasAllArgs || hasBuilder) {
      let args = fields.map(f => `${f.type} ${f.name}`).join(', ');
      let assigns = fields.map(f => `            this.${f.name} = ${f.name};`).join('\n');
      additions += `\n        public ${className}(${args}) {\n${assigns}\n        }\n`;
    }
    if (hasData) additions += getGettersSettersFor(fields).replace(/\n/g, '\n    ');
    if (hasBuilder) additions += getBuilderFor(className, fields).replace(/\n/g, '\n    ');

    content = content.replace(orig, `public static class ${className} {${replacedBody}${additions}}`);
  }

  fs.writeFileSync(f, content, 'utf8');
}

// 1. Entities
getFiles(entityDir).forEach(processEntity);

// 2. DTOs (inner classes)
getFiles(dtoDir).forEach(processInnerClasses);

// 3. Services / Controllers - @Slf4j and @RequiredArgsConstructor
getFiles(srcDir).forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('@Slf4j')) {
    content = content.replace(/^import\s+lombok\..*;\s*$/gm, '');
    let className = path.basename(f, '.java');
    content = content.replace(/@Slf4j\s*/g, '');
    let rxBody = /public\s+class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[^\{]+)?\s*\{/;
    content = content.replace(rxBody, `$& \n    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(${className}.class);`);
    changed = true;
  }
  
  if (content.includes('@RequiredArgsConstructor')) {
      content = content.replace(/@RequiredArgsConstructor\s*/g, '');
      let className = path.basename(f, '.java');
      // find final fields
      const finalRx = /^\s*private\s+final\s+(\w+(?:<[^>]+>)?)\s+(\w+)\s*;/gm;
      let finals = [];
      let m;
      while ((m = finalRx.exec(content)) !== null) {
          finals.push({type: m[1], name: m[2]});
      }
      if (finals.length > 0) {
          let args = finals.map(fi => `${fi.type} ${fi.name}`).join(', ');
          let assigns = finals.map(fi => `        this.${fi.name} = ${fi.name};`).join('\n');
          let cons = `\n    public ${className}(${args}) {\n${assigns}\n    }\n`;
          let classRx = /public\s+class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[^\{]+)?\s*\{/;
          content = content.replace(classRx, `$& ${cons}`);
      }
      changed = true;
  }
  
  // Spring boot 3.2 uses @RestController, we might need explicit @Autowired on constructors
  // Not strictly required for single constructor in Spring, but good practice.
  
  if (changed) {
      fs.writeFileSync(f, content, 'utf8');
  }
});

console.log("Lombok manually removed part 2!");
