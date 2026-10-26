//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C5Klusa0.js
var manifest = {
	"1ac20e83585a55e943670fa4670b07889b610801a7a21f28dc367c19f92e50fd": {
		functionName: "submitContact_createServerFn_handler",
		importer: () => import("./_ssr/contact.functions-9FDMQMX4.mjs")
	},
	"59c84ce77fdd4d25658ee699331e52e534722446c4655acf447caa74e9f698a1": {
		functionName: "resetConsultation_createServerFn_handler",
		importer: () => import("./_ssr/consult.functions-C0E17T57.mjs")
	},
	"7f0554bcf4014fcbcd608aa28a16af2fc22ac0c67e21a42cf81afd4c53808ba2": {
		functionName: "getConsultation_createServerFn_handler",
		importer: () => import("./_ssr/consult.functions-C0E17T57.mjs")
	},
	"df921925b0a29c27fa9db635e4caac3c1afac590ba3a4d59a6112d6907c3b641": {
		functionName: "startConsultation_createServerFn_handler",
		importer: () => import("./_ssr/consult.functions-C0E17T57.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
