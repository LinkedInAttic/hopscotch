#!/bin/bash
VERSION=0.1
CLOSURE_COMPILER_PATH=/path/to/compiler-latest/compiler.jar
HOPSCOTCH_PATH=/path/to/hopscotch

echo ""
echo "Hopscotch path set to: $HOPSCOTCH_PATH"
echo "Hopscotch version set to: $VERSION"
echo ""
echo "This script uses the Google Closure Compiler."
echo "(https://developers.google.com/closure/compiler/)"
echo ""
echo "Closure compiler path set to:"
echo $CLOSURE_COMPILER_PATH
echo ""
echo "Minifying Javascript..."
echo "======================="
java -jar $CLOSURE_COMPILER_PATH --js=$HOPSCOTCH_PATH/js/hopscotch-$VERSION.js --js_output_file=$HOPSCOTCH_PATH/js/hopscotch-$VERSION.min.js
echo "Done minifying Javascript!"
echo ""
echo "Compiling CSS..."
echo "================"
lessc -x $HOPSCOTCH_PATH/less/hopscotch.less > $HOPSCOTCH_PATH/css/hopscotch.css
echo "Done compiling CSS!"
echo ""
