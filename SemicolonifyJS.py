# -*- coding: utf-8 -*-
import sublime
import sublime_plugin
from os.path import dirname, realpath, join, basename, splitext
from subprocess import Popen, PIPE, STDOUT
import json

package_dir = dirname(realpath(__file__))
runner_path = join(package_dir, "runner.js")
p = Popen(["node", runner_path], shell=True, stdout=PIPE, stdin=PIPE, stderr=STDOUT, bufsize=0)

def unload_handler():
	try:
		p.terminate()
	except:
		pass

class EventHandler(sublime_plugin.EventListener):
	def on_pre_save(self, view):
		if splitext(basename(view.settings().get("syntax")))[0] == "JavaScript":
			view.run_command("insert_semicolons")

class InsertSemicolons(sublime_plugin.TextCommand):
	def run(self, edit, user_input=None):
		content_length = self.view.size()
		p.stdin.write((str(content_length) + '\n' + self.view.substr(sublime.Region(0, content_length))).encode("utf8"))
		ret = p.stdout.readline().decode("utf8").rstrip()
		if ret:
			arr = json.loads(ret)
			for pos in reversed(arr):
				self.view.insert(edit, self.view.text_point(pos[0], pos[1]), ";")
