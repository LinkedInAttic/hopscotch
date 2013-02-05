#!/bin/bash
echo ""
echo "Minifying files into assets.js..."
echo "================================="
echo "This script uses the Google Closure Compiler and assumes the location of the compiler is:"
echo "/Users/gkoo/workspace/compiler-latest-1/compiler.jar"
echo ""
echo "INPUT FILES:"
echo "============"
echo "hopscotch-0.0.4.js"

java -jar /Users/gkoo/workspace/compiler-latest-1/compiler.jar --js=/Users/gkoo/Sites/hopscotch/js/hopscotch-0.0.4.js --js_output_file=/Users/gkoo/Sites/hopscotch/js/hopscotch-0.0.4.min.js
#java -jar /Users/gkoo/workspace/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type js /Users/gkoo/Sites/hopscotch/js/hopscotch-0.0.3.js > /Users/gkoo/Sites/hopscotch/js/hopscotch-0.0.3.min.js

echo "Done minifying..."

echo ""
echo "Compiling LESS > CSS..."
lessc -x /Users/gkoo/Sites/hopscotch/css/hopscotch.less > /Users/gkoo/Sites/hopscotch/css/hopscotch.css
echo "Done compiling..."
