#!/usr/bin/env python3

from pathlib import Path
import sys;

filenames = [];
decls     = [];

root_dir    = sys.argv[1].replace("./", "");
output_file = sys.argv[2];

for path in Path(root_dir).glob("**/*.png"):
    quoted_path = "\"{0}\"".format(path)
    filenames.append(quoted_path);

    varname = str(path)        \
        .replace("./",     "") \
        .replace(root_dir, "") \
        .replace(".png",   "") \
        .replace("/",     "_") \
        .upper();

    decl = "const {varname} = {filename}".format(
        varname  = varname,
        filename = quoted_path
    );
    decls.append(decl);

with open(output_file, "w") as f:
    f.write("\n".join(decls));
    f.write("\n\n");
    f.write("const TEXTURES_TO_LOAD = [ {0} ]".format(
        ",\n".join(filenames)
    ))
