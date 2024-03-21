##~---------------------------------------------------------------------------##
##                               *       +                                    ##
##                         '                  |                               ##
##                     ()    .-.,="``"=.    - o -                             ##
##                           '=/_       \     |                               ##
##                        *   |  '=._    |                                    ##
##                             \     `=./`,        '                          ##
##                          .   '=.__.=' `='      *                           ##
##                 +                         +                                ##
##                      O      *        '       .                             ##
##                                                                            ##
##  File      : build-static.ps1                                              ##
##  Project   : Same Game                                                     ##
##  Date      : 2024-03-21                                                    ##
##  License   : See project's COPYING.TXT for full info.                      ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2024                                         ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##---------------------------------------------------------------------------~##

Write-Output "==> Building static...";

## retrive build and version.
touch ".buildno"; ## in case that it doesn't exists.

$VERSION="$(git describe --abbrev=0 --tags)";
if($VERSION.Length -eq 0) {
    $VERSION="pre-release";
}

$CURR_BUILD = [int](Get-Content ".buildno");
if($CURR_BUILD.Length -eq 0) {
    $CURR_BUILD = 0;
}

$NEXT_BUILD = ($CURR_BUILD + 1);
$DATE       = (Get-Date).ToString('HH:mm:ss dd-MM-yyyy - zz');

Write-Output "BUILD: ${CURR_BUILD} - NEXT_BUILD: ${NEXT_BUILD}";

## clean dir.
Remove-Item -Force -Recurse  "./out/";
New-Item -ItemType Directory "./out/";

## copy things.
Copy-Item -Recurse "./index.html"  "./out/";
Copy-Item -Recurse "./src"         "./out/";
Copy-Item -Recurse "./libs"        "./out/";
Copy-Item -Recurse "./res"         "./out/";

$replaced_index = (Get-Content "./out/index.html")     `
                      -replace "_version_", "$VERSION" `
                      -replace "_build_", $NEXT_BUILD  `
                      -replace "_date_", $DATE;


$replaced_index | Out-File "./out/index.html.tmp";
$NEXT_BUILD     | Out-File ".buildno";

Move-Item -Force "./out/index.html.tmp" "./out/index.html";

Write-Output "==> done...";