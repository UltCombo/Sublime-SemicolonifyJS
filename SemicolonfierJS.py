# -*- coding: utf-8 -*-
import sublime
import sublime_plugin
from os import remove
from os.path import dirname, realpath, join, basename, splitext
from subprocess import Popen, PIPE
import json

package_dir = dirname(realpath(__file__))
lint_config_file_name = join(package_dir, "jshint.json")
lint_reporter_file_name = join(package_dir, "reporter.js")
tmp_file_name = join(package_dir, "tmp.js")

class EventHandler(sublime_plugin.EventListener):
	def on_pre_save(self, view):
		if splitext(basename(view.settings().get('syntax')))[0] == "JavaScript":
			with open(tmp_file_name, "w") as f:
				f.write(("//jshint -W015\n" + view.substr(sublime.Region(0, view.size()))).encode('utf8')) #[TABHACK]
			arr = json.loads(Popen(["jshint", "--config", lint_config_file_name, "--reporter", lint_reporter_file_name, tmp_file_name], shell=True, stdout=PIPE).stdout.read())
			#print arr; return #for debugging
			if arr:
				edit = view.begin_edit()
				for pos in reversed(arr):
					view.insert(edit, view.text_point(pos[0], pos[1]), ";")
				view.end_edit(edit)
			remove(tmp_file_name)
