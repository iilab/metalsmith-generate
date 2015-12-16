var path = require('path');
var fs = require('fs');


function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


function keyify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '_')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-/g, '_')         // Replace multiple - with single -
    .replace(/\-\-+/g, '_')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Creates files at specified path with their metadata
 *
 * @param file {Array} array of files to be created, each item of
 * the array should be an object containing a `path` entry (String)
 * an optional `content` entry (String) and an optional `metadata` entry (Object)
 *
 * @return {Function}
 */
module.exports = function (rules) {
    var rules = rules || [];

    return function (files, metalsmith, done) {
        setImmediate(done);

        rules.forEach(function (rule) {
            var type = rule.type || "file";
            var slug = rule.slugify || false;
                        
            if (type =="file") {
                var file_path = rule.path

                if (!files[file_path]) files[file_path] = {}

                if (rule.contents) {
                    files[file_path].contents = new Buffer(rule.contents);
                } else {
                    files[file_path].contents = new Buffer("");
                }

                if (rule.metadata) {
                    Object.assign(files[file_path], rule.metadata)
                }

            } else if (type =="metadata") {
                var metadata = getDescendantProp(metalsmith.metadata(), rule.src);
                metadata.forEach(function(item) {
                  if (item[rule.name]) {
                      var slug = slugify(item[rule.name])
                      var file_path = path.join(rule.path, slug +  rule.ext)

                      var buffer = fs.readFileSync(rule.contents);


                      files[file_path] = {
                        title       : item[rule.name],
                        contents    : buffer, // Contents needs to be defined beacuse other plugins expect it
                      };

                      if (slug) {
                        Object.keys(item).forEach(function(k, v) {
                          if (k !== keyify(k)) {
                            Object.defineProperty(item, keyify(k),
                                Object.getOwnPropertyDescriptor(item, k));
                            delete item[k];
                          }
                        })
                      }
                      
                      Object.assign(files[file_path], item, rule.metadata)
                        
                    }
                })


            } else {
                done("Error: Wrong type in metalsmith-generate rules")
            }

        });

    };
};
