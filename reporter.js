module.exports = {
	reporter: function (errors) {
		"use strict";
		var ret = [], error;
		//process.stdout.write(JSON.stringify(errors)); return; //for debugging
		for (var i = 0; i < errors.length; i++) {
			error = errors[i].error;
			//W033 === missing semicolon
			if (error.code === 'W033') {
				//line and char -1 for 0-based indexing
				//[TABHACK] line -1 due to dynamically added jshint indentation warning suppression https://github.com/jshint/jshint/pull/1198#issuecomment-22469206
				ret.push([error.line-2, error.character-1]);
			}
		}
		process.stdout.write(JSON.stringify(ret));
	}
};
