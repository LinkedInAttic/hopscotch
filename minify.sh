#!/bin/bash
echo ""
echo "Minifying files into assets.js..."
echo "================================="
echo "This script uses Google Closure Compiler (http://code.google.com/closure/compiler/) and assumes the location of the compiler is:"
echo "~/workspace/compiler-latest/compiler.jar"
echo ""
echo "INPUT FILES:"
echo "============"
echo "hopscotch.js"

java -jar /Users/gkoo/workspace/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar --type js js/hopscotch.js > js/hopscotch-min.js

echo "Done minifying..."

echo ""
echo "Compiling LESS > CSS..."
lessc -x css/hopscotch.less > css/hopscotch.css
