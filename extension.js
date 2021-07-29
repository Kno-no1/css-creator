// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const getCss = require('./getCss')
const exec = require('child_process').exec
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "css-creator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('css-creator.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		// 获取光标区域内容？？？？？？？？
		// | undefined = vscode.window.activeTextEditor
		vscode.window.activeTextEditor.edit(() => {
			const st = vscode.window.activeTextEditor.selection.start
			const ed = vscode.window.activeTextEditor.selection.end
			const nodeStr = vscode.workspace.textDocuments[0].getText(new vscode.Range(st,ed))
			
			const res = getCss(nodeStr)
			if(res.trim() == ''){
				vscode.window.showInformationMessage('css-creater:生成失败');
				return
			}
			console.log(nodeStr,res)
			// linux
			exec('echo ' + res + ' | pbcopy')
			// windows
			exec('echo ' + res + ' | clip')
			// 从开始到结束，全量替换
			// const text = '新替换的内容';
			// editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage('css-creater:生成成功');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
	console.log('^^^^^^^^^^^^^^^^^^^^插件已退出^^^^^^^^^^^^^^^^^^^^^^')
}

module.exports = {
	activate,
	deactivate
}
