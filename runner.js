var JSHINT = require('jshint').JSHINT,
	//all warnings disabled except semicolons;
	//removed es5:true which is default now, as having that option here would emit an info to the reporter;
	//globals should go as 3rd parameter of JSHINT call;
	//[TABHACK] "indent":1 to count tab as a single character, see https://github.com/jshint/jshint/pull/1198#issuecomment-22469206
	options = {
		"maxerr"        : false,       // {int} Maximum error before stopping

		// Enforcing
		"bitwise"       : false,     // true: Prohibit bitwise operators (&, |, ^, etc.)
		"camelcase"     : false,    // true: Identifiers must be in camelCase
		"curly"         : false,     // true: Require {} for every new block or scope
		"eqeqeq"        : false,     // true: Require triple equals (===) for comparison
		"forin"         : false,     // true: Require filtering for..in loops with obj.hasOwnProperty()
		"immed"         : false,    // true: Require immediate invocations to be wrapped in parens e.g. `(function () { } ());`
		"indent"        : 1,        // {int} Number of spaces to use for indentation
		"latedef"       : false,    // true: Require variables/functions to be defined before being used
		"newcap"        : false,    // true: Require capitalization of all constructor functions e.g. `new F()`
		"noarg"         : false,     // true: Prohibit use of `arguments.caller` and `arguments.callee`
		"noempty"       : false,     // true: Prohibit use of empty blocks
		"nonew"         : false,    // true: Prohibit use of constructors for side-effects (without assignment)
		"plusplus"      : false,    // true: Prohibit use of `++` & `--`
		"quotmark"      : false,    // Quotation mark consistency:
									//   false    : do nothing (default)
									//   true     : ensure whatever is used is consistent
									//   "single" : require single quotes
									//   "double" : require double quotes
		"undef"         : false,     // true: Require all non-global variables to be declared (prevents global leaks)
		"unused"        : false,     // true: Require all defined variables be used
		"strict"        : false,     // true: Requires all functions run in ES5 Strict Mode
		"trailing"      : false,    // true: Prohibit trailing whitespaces
		"maxparams"     : false,    // {int} Max number of formal params allowed per function
		"maxdepth"      : false,    // {int} Max depth of nested blocks (within functions)
		"maxstatements" : false,    // {int} Max number statements per function
		"maxcomplexity" : false,    // {int} Max cyclomatic complexity per function
		"maxlen"        : false,    // {int} Max number of characters per line

		// Relaxing
		"asi"           : false,     // true: Tolerate Automatic Semicolon Insertion (no semicolons)
		"boss"          : true,     // true: Tolerate assignments where comparisons would be expected
		"debug"         : true,     // true: Allow debugger statements e.g. browser breakpoints.
		"eqnull"        : true,     // true: Tolerate use of `== null`
		//"es5"           : true,     // true: Allow ES5 syntax (ex: getters and setters)
		"esnext"        : true,     // true: Allow ES.next (ES6) syntax (ex: `const`)
		"moz"           : true,     // true: Allow Mozilla specific syntax (extends and overrides esnext features)
									// (ex: `for each`, multiple try/catch, function expression…)
		"evil"          : true,     // true: Tolerate use of `eval` and `new Function()`
		"expr"          : true,     // true: Tolerate `ExpressionStatement` as Programs
		"funcscope"     : true,     // true: Tolerate defining variables inside control statements"
		"globalstrict"  : true,     // true: Allow global "use strict" (also enables 'strict')
		"iterator"      : true,     // true: Tolerate using the `__iterator__` property
		"lastsemic"     : true,     // true: Tolerate omitting a semicolon for the last statement of a 1-line block
		"laxbreak"      : true,     // true: Tolerate possibly unsafe line breakings
		"laxcomma"      : true,     // true: Tolerate comma-first style coding
		"loopfunc"      : true,     // true: Tolerate functions being defined in loops
		"multistr"      : true,     // true: Tolerate multi-line strings
		"proto"         : true,     // true: Tolerate using the `__proto__` property
		"scripturl"     : true,     // true: Tolerate script-targeted URLs
		"smarttabs"     : true,     // true: Tolerate mixed tabs/spaces when used for alignment
		"shadow"        : true,     // true: Allows re-define variables later in code e.g. `var x=1; x=2;`
		"sub"           : true,     // true: Tolerate using `[]` notation when it can still be expressed in dot notation
		"supernew"      : true,     // true: Tolerate `new function () { ... };` and `new Object;`
		"validthis"     : true,     // true: Tolerate using this in a non-constructor function

		// Environments
		"browser"       : true,     // Web Browser (window, document, etc)
		"couch"         : false,    // CouchDB
		"devel"         : true,     // Development/debugging (alert, confirm, etc)
		"dojo"          : false,    // Dojo Toolkit
		"jquery"        : false,    // jQuery
		"mootools"      : false,    // MooTools
		"node"          : false,    // Node.js
		"nonstandard"   : false,    // Widely adopted globals (escape, unescape, etc)
		"prototypejs"   : false,    // Prototype and Scriptaculous
		"rhino"         : false,    // Rhino
		"worker"        : false,    // Web Workers
		"wsh"           : false,    // Windows Scripting Host
		"yui"           : false,    // Yahoo User Interface

		// Legacy
		"nomen"         : false,    // true: Prohibit dangling `_` in variables
		"onevar"        : false,    // true: Allow only one `var` statement per function
		"passfail"      : false,    // true: Stop on first error
		"white"         : false,    // true: Check against strict whitespace and indentation rules

		// Custom Globals
		//"globals"       : {}        // additional predefined global variables
	},
	handling = false,
	data = '',
	contentLength;

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
	var indexOfFirstLineBreak;
	if (!handling) {
		handling = true;
		indexOfFirstLineBreak = chunk.indexOf('\n');
		contentLength = +chunk.substring(0, indexOfFirstLineBreak);
		data = chunk.substring(indexOfFirstLineBreak + 1);
	} else {
		data += chunk;
	}
	if (data.length === contentLength) handleInput();
});

function handleInput() {
	//[TABHACK] suppress indentation warnings
	if (!JSHINT('//jshint -W015\n' + data, options)) {
		var errors = JSHINT.errors,
			ret = [];
		for (var i = 0; i < errors.length; i++) {
			//W033 === missing semicolon
			if (errors[i].code === 'W033') {
				//line and char -1 for 0-based indexing
				//[TABHACK] line -1 to compensate for the indentation warnings supression
				ret.push([errors[i].line-2, errors[i].character-1]);
			}
		}
		process.stdout.write(JSON.stringify(ret) + '\n');
	} else {
		process.stdout.write('\n');
	}
	handling = false;
}
