import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  X,
  Stethoscope,
} from 'lucide-react'
import {
  mappingDiagnosticsService,
  type FullMappingReport,
} from '../services/mappingDiagnostics.service'

interface MappingDiagnosticsModalProps {
  isOpen: boolean
  onClose: () => void
  teacherId: string
  testStudentId?: string
}

export const MappingDiagnosticsModal: React.FC<MappingDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  teacherId,
  testStudentId,
}) => {
  const [report, setReport] = useState<FullMappingReport | null>(null)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    try {
      const result = await mappingDiagnosticsService.runFullDiagnostics(teacherId, testStudentId)
      setReport(result)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      runDiagnostics()
    }
  }, [isOpen, teacherId, testStudentId])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostics-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-[#0e0520] border-2 border-[#00f5ff]/60 rounded-3xl shadow-[0_0_50px_rgba(0,245,255,0.25)] text-white overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#a855f7]/30 flex items-center justify-between bg-[#160a33]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.3)]">
              <Stethoscope className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="diagnostics-modal-title" className="text-xl font-extrabold font-fredoka text-white">
                  Student–Teacher Mapping Health Check
                </h2>
                {report && (
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      report.overallStatus === 'healthy'
                        ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40'
                        : report.overallStatus === 'degraded'
                        ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/40'
                        : 'bg-[#ff2a85]/20 text-[#ff2a85] border-[#ff2a85]/40'
                    }`}
                  >
                    {report.overallStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200/80">
                Audits authentication, classroom association, RLS boundaries, and duplicate prevention.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runDiagnostics}
              disabled={isRunning}
              className="p-2 rounded-xl bg-[#160a33] border border-[#00f5ff]/40 text-[#00f5ff] hover:bg-[#200e47] transition-all"
              title="Re-run health check"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#160a33] border border-[#a855f7]/40 text-purple-200 hover:text-white hover:bg-[#ff2a85]/20 transition-all"
              aria-label="Close health check"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {isRunning && !report && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#00f5ff] mx-auto" />
              <p className="text-sm font-bold text-purple-200">Running diagnostic verification suite...</p>
            </div>
          )}

          {report && (
            <>
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#10b981]/40 text-center">
                  <div className="text-2xl font-extrabold text-[#10b981]">{report.summary.passed}</div>
                  <div className="text-[11px] font-bold text-emerald-200/80 uppercase">Checks Passed</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#ffd700]/40 text-center">
                  <div className="text-2xl font-extrabold text-[#ffd700]">{report.summary.warnings}</div>
                  <div className="text-[11px] font-bold text-amber-200/80 uppercase">Warnings</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#160a33] border border-[#ff2a85]/40 text-center">
                  <div className="text-2xl font-extrabold text-[#ff2a85]">{report.summary.failed}</div>
                  <div className="text-[11px] font-bold text-pink-200/80 uppercase">Failures</div>
                </div>
              </div>

              {/* Individual Checks List */}
              <div className="space-y-3">
                {report.checks.map((check) => {
                  return (
                    <div
                      key={check.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        check.status === 'passed'
                          ? 'border-[#10b981]/30 bg-[#160a33]/60'
                          : check.status === 'warning'
                          ? 'border-[#ffd700]/50 bg-[#160a33]'
                          : 'border-[#ff2a85]/60 bg-[#200512]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">
                            {check.status === 'passed' && (
                              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                            )}
                            {check.status === 'warning' && (
                              <AlertTriangle className="w-5 h-5 text-[#ffd700]" />
                            )}
                            {check.status === 'failed' && (
                              <XCircle className="w-5 h-5 text-[#ff2a85]" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-sm text-white">{check.name}</h3>
                              <span className="text-[10px] text-purple-300/60 font-mono">
                                {check.durationMs}ms
                              </span>
                            </div>
                            <p className="text-xs text-purple-200/90 mt-0.5 leading-relaxed">
                              {check.message}
                            </p>
                            {check.actionableGuidance && (
                              <p className="text-xs font-semibold text-[#ffd700] mt-1.5 flex items-center gap-1.5 bg-[#ffd700]/10 border border-[#ffd700]/25 px-2.5 py-1 rounded-lg">
                                <span>Action: {check.actionableGuidance}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 border ${
                            check.status === 'passed'
                              ? 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30'
                              : check.status === 'warning'
                              ? 'text-[#ffd700] bg-[#ffd700]/15 border-[#ffd700]/30'
                              : 'text-[#ff2a85] bg-[#ff2a85]/15 border-[#ff2a85]/30'
                          }`}
                        >
                          {check.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#a855f7]/30 bg-[#160a33] flex items-center justify-between gap-4">
          <span className="text-xs text-purple-200/70">
            Environment: <code className="text-[#00f5ff] font-mono">{report?.environment || 'checking...'}</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold btn-neon-purple"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  )
}
