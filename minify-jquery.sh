#!/bin/bash
echo ""
echo "Minifying files into assets.js..."
echo "================================="
echo "This script uses Google Closure Compiler (http://code.google.com/closure/compiler/) and assumes the location of the compiler is:"
echo "~/workspace/compiler-latest/compiler.jar"
echo ""
echo "INPUT FILES:"
echo "============"
echo "hopscotch_jquery.js"

java -jar /Users/gkoo/workspace/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type js /Users/gkoo/Sites/hopscotch/js/hopscotch_jquery.js > /Users/gkoo/Sites/hopscotch/js/hopscotch_jquery-min.js

echo "Done minifying..."
