# -*- coding: utf-8 -*-
import sublime
import sublime_plugin
from os.path import dirname, realpath, join, basename, splitext
from subprocess import Popen, PIPE, STDOUT
import json

package_dir = dirname(realpath(__file__))
runner_path = join(package_dir, "runner.js")
p = Popen(["node", runner_path], shell=True, stdout=PIPE, stdin=PIPE, stderr=STDOUT)

def unload_handler():
	try:
		p.terminate()
	except:
		pass

class EventHandler(sublime_plugin.EventListener):
	def on_pre_save(self, view):
		if splitext(basename(view.settings().get("syntax")))[0] == "JavaScript":
			content_length = view.size()
			p.stdin.write((str(content_length) + '\n' + view.substr(sublime.Region(0, content_length))).encode("utf8"))
			ret = p.stdout.readline().rstrip()
			if ret:
				arr = json.loads(ret)
				edit = view.begin_edit()
				for pos in reversed(arr):
					view.insert(edit, view.text_point(pos[0], pos[1]), ";")
				view.end_edit(edit)
