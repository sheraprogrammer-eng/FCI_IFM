const InsuranceModel = require('../models/InsuranceModel');
class InsuranceController {
    async createIfm(req, res) {
        try {
            const ifmData = req.body;
            const result = await InsuranceModel.createIfm(ifmData);
            res.json({
                success: true,
                message: 'บันทึกข้อมูล ifm เรียบร้อยแล้ว',
                Quatation_No: result.Quatation_No
            });
        } catch (error) {
            const serializeError = (err) => {
                if (!err) return null;
                const original = err.originalError || err.parent || null;
                const info = original && (original.info || original);
                return {
                    name: err.name,
                    message: err.message,
                    code: err.code ?? info?.code ?? null,
                    number: err.number ?? info?.number ?? null,
                    state: err.state ?? info?.state ?? null,
                    class: err.class ?? info?.class ?? null,
                    lineNumber: err.lineNumber ?? info?.lineNumber ?? null,
                    procName: err.procName ?? info?.procName ?? null,
                    serverName: info?.serverName ?? null,
                    precedingErrors: (err.precedingErrors || []).map(pe => ({
                        message: pe.message,
                        number: pe.number ?? null,
                        lineNumber: pe.lineNumber ?? null
                    })),
                    info: info || null,
                    stack: err.stack
                };
            };
            console.error('Error in createIfm:', error);
            res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล ifm',
                error: error.message,
                sqlError: serializeError(error)
            });
        }
    }
}
module.exports = new InsuranceController();