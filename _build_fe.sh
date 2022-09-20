

rm -rf htdocs/js/external  htdocs/css htdocs/fonts
mkdir -p htdocs/js/external  htdocs/css htdocs/fonts


# ----- EXTERNAL JS
cp \
node_modules/vis-network/dist/vis-network.min.js \
node_modules/chart.js/dist/Chart.min.js \
node_modules/jquery/dist/jquery.min.js \
node_modules/jquery-ui-dist/jquery-ui.min.js \
node_modules/jstimezonedetect/dist/jstz.min.js \
node_modules/xss/dist/xss.min.js \
node_modules/ansi_up/ansi_up.js \
node_modules/diff/dist/diff.min.js \
node_modules/graphlib/dist/graphlib.min.js \
node_modules/moment/min/moment.min.js \
node_modules/moment-timezone/builds/moment-timezone-with-data.min.js  \
node_modules/socket.io/client-dist/socket.io.min.js \
node_modules/zxcvbn/dist/zxcvbn.js \
htdocs/js/external/

# ---- EXTERNAL CSS
cp \
node_modules/chart.js/dist/Chart.min.css \
node_modules/vis-network/dist/dist/vis-network.min.css \
node_modules/font-awesome/css/font-awesome.min.css \
node_modules/@mdi/font/css/materialdesignicons.min.css \
node_modules/jquery-ui-dist/jquery-ui.min.css \
htdocs/css/

# ------ CODE MIRROR
cat node_modules/codemirror/lib/codemirror.js \
   node_modules/codemirror/addon/scroll/simplescrollbars.js \
   node_modules/codemirror/addon/edit/matchbrackets.js \
   node_modules/codemirror/addon/selection/active-line.js \
   node_modules/codemirror/mode/powershell/powershell.js \
   node_modules/codemirror/mode/javascript/javascript.js \
   node_modules/codemirror/mode/python/python.js \
   node_modules/codemirror/mode/perl/perl.js \
   node_modules/codemirror/mode/shell/shell.js \
   node_modules/codemirror/mode/groovy/groovy.js \
   node_modules/codemirror/mode/clike/clike.js \
   node_modules/codemirror/mode/properties/properties.js \
   node_modules/codemirror/addon/display/fullscreen.js \
   node_modules/codemirror/mode/xml/xml.js \
   node_modules/codemirror/mode/sql/sql.js \
   node_modules/js-yaml/dist/js-yaml.min.js  \
   node_modules/codemirror/addon/lint/lint.js \
   node_modules/codemirror/addon/lint/json-lint.js \
   node_modules/codemirror/addon/lint/yaml-lint.js \
   node_modules/codemirror/addon/mode/simple.js \
   node_modules/codemirror/mode/dockerfile/dockerfile.js \
   node_modules/codemirror/mode/yaml/yaml.js  \
   node_modules/jsonlint-mod/web/jsonlint.js \
   | esbuild --minify > htdocs/js/external/codemirror.min.js

# --------------   codemirror css
cat \
node_modules/codemirror/lib/codemirror.css \
node_modules/codemirror/theme/darcula.css \
node_modules/codemirror/theme/solarized.css \
node_modules/codemirror/theme/gruvbox-dark.css \
node_modules/codemirror/addon/scroll/simplescrollbars.css \
node_modules/codemirror/addon/display/fullscreen.css \
node_modules/codemirror/addon/lint/lint.css \
> htdocs/css/codemirror.css

 # ---- FONTS ---------
 cp \
 node_modules/@mdi/font/fonts/* \
 node_modules/font-awesome/fonts/* \
 node_modules/pixl-webapp/fonts/*  \
 htdocs/fonts/

# ----------- MAIN ---------------

cat node_modules/pixl-webapp/js/xml.js \
	node_modules/pixl-webapp/js/tools.js \
	node_modules/pixl-webapp/js/datetime.js \
    | esbuild --minify > htdocs/js/common.core.min.js 
     
cat node_modules/pixl-webapp/js/md5.js \
	node_modules/pixl-webapp/js/oop.js \
	node_modules/pixl-webapp/js/xml.js \
	node_modules/pixl-webapp/js/tools.js \
	node_modules/pixl-webapp/js/datetime.js \
	node_modules/pixl-webapp/js/page.js \
	node_modules/pixl-webapp/js/dialog.js \
	node_modules/pixl-webapp/js/base.js \
    | esbuild --minify > htdocs/js/common.min.js 

cat frontend/app.js \
	frontend/pages/Base.class.js \
	frontend/pages/Home.class.js \
	frontend/pages/Login.class.js \
	frontend/pages/Schedule.class.js \
	frontend/pages/History.class.js \
	frontend/pages/JobDetails.class.js \
	frontend/pages/MyAccount.class.js \
	frontend/pages/Admin.class.js \
	frontend/pages/admin/Categories.js \
	frontend/pages/admin/Servers.js \
	frontend/pages/admin/Users.js \
	frontend/pages/admin/Plugins.js \
	frontend/pages/admin/Activity.js \
	frontend/pages/admin/APIKeys.js \
    | esbuild --minify > htdocs/js/cronicle.min.js

 cp frontend/home-worker.js htdocs/js/

 cp node_modules/pixl-webapp/css/base.css \
   frontend/style.css  htdocs/css/

 