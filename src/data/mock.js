export const regions = [
  { name: 'Addis Ababa', code: 'AA', operators: 148, synced: 96, risk: 'low', registrations: 48210 },
  { name: 'Oromia', code: 'OR', operators: 236, synced: 89, risk: 'medium', registrations: 68430 },
  { name: 'Amhara', code: 'AM', operators: 184, synced: 91, risk: 'medium', registrations: 55920 },
  { name: 'Tigray', code: 'TG', operators: 82, synced: 74, risk: 'high', registrations: 20480 },
  { name: 'Somali', code: 'SM', operators: 104, synced: 68, risk: 'high', registrations: 17650 },
  { name: 'SNNPR', code: 'SN', operators: 121, synced: 94, risk: 'low', registrations: 36810 }
]

export const operators = [
  { code: 'OP-10024', name: 'Amanuel Tesfaye', region: 'Addis Ababa', supervisor: 'Mekdes Haile', cert: '有效', status: '在岗', monthly: 412, quality: 92, attendance: '98%', device: 'KIT-MULTI-0218' },
  { code: 'OP-10331', name: 'Hana Bekele', region: 'Oromia', supervisor: 'Dawit Tola', cert: '即将到期', status: '在岗', monthly: 386, quality: 87, attendance: '94%', device: 'KIT-MULTI-0332' },
  { code: 'OP-10812', name: 'Yared Alemu', region: 'Somali', supervisor: 'Abdi Omar', cert: '有效', status: '离线巡检', monthly: 228, quality: 78, attendance: '91%', device: 'KIT-FP-0904' },
  { code: 'OP-11107', name: 'Selam Getachew', region: 'Amhara', supervisor: 'Mulu Wondimu', cert: '已过期', status: '停用', monthly: 92, quality: 61, attendance: '72%', device: '未绑定' },
  { code: 'OP-11440', name: 'Abel Girma', region: 'Tigray', supervisor: 'Tadesse Gebre', cert: '有效', status: '在岗', monthly: 301, quality: 83, attendance: '96%', device: 'KIT-IRIS-0127' }
]

export const devices = [
  { id: 'KIT-MULTI-0218', type: 'MULTI', model: 'BioSuite X4', holder: 'Amanuel Tesfaye', region: 'Addis Ababa', battery: 84, storage: 41, status: '已分配', lastOnline: '6分钟前', gps: '9.0249, 38.7468', cert: '正常' },
  { id: 'KIT-MULTI-0332', type: 'MULTI', model: 'BioSuite X4', holder: 'Hana Bekele', region: 'Oromia', battery: 51, storage: 68, status: '已分配', lastOnline: '28分钟前', gps: '8.9806, 38.7578', cert: '正常' },
  { id: 'KIT-FP-0904', type: 'FINGERPRINT', model: 'PrintEdge 2', holder: 'Yared Alemu', region: 'Somali', battery: 19, storage: 86, status: '告警', lastOnline: '2天前', gps: '9.3500, 42.8000', cert: '待轮换' },
  { id: 'KIT-IRIS-0127', type: 'IRIS', model: 'IrisField 7', holder: 'Abel Girma', region: 'Tigray', battery: 66, storage: 53, status: '已分配', lastOnline: '4小时前', gps: '13.4967, 39.4753', cert: '正常' },
  { id: 'KIT-MULTI-0113', type: 'MULTI', model: 'BioSuite X3', holder: '仓库', region: 'Amhara', battery: 100, storage: 9, status: '可用', lastOnline: '1小时前', gps: '11.5936, 37.3908', cert: '正常' }
]

export const syncQueues = [
  { node: 'edge-aa-01', region: 'Addis Ababa', pending: 142, failed: 3, latency: '1.8s', throughput: '1,240/min', uptime: '99.96%', mode: '在线' },
  { node: 'edge-or-03', region: 'Oromia', pending: 890, failed: 26, latency: '7.4s', throughput: '620/min', uptime: '99.41%', mode: '弱网' },
  { node: 'edge-sm-02', region: 'Somali', pending: 2240, failed: 74, latency: '32s', throughput: '180/min', uptime: '97.30%', mode: '离线自治' },
  { node: 'edge-tg-01', region: 'Tigray', pending: 1360, failed: 48, latency: '18s', throughput: '310/min', uptime: '98.12%', mode: '弱网' }
]

export const enrollments = [
  { id: 'REC-998877', operator: 'OP-10024', region: 'Addis Ababa', score: 94, duplicate: 'CLEAR', gps: '8m', bio: '指纹/面部/虹膜', status: '已入主库', synced: '09:42' },
  { id: 'REC-998878', operator: 'OP-10331', region: 'Oromia', score: 76, duplicate: 'CLEAR', gps: '22m', bio: '指纹/面部', status: '可接受', synced: '09:45' },
  { id: 'REC-998879', operator: 'OP-10812', region: 'Somali', score: 42, duplicate: 'REVIEW', gps: '138m', bio: '面部', status: '需人工复核', synced: '排队中' },
  { id: 'REC-998880', operator: 'OP-11440', region: 'Tigray', score: 81, duplicate: 'BIOMETRIC_MATCH', gps: '19m', bio: '指纹/虹膜', status: '疑似重复', synced: '10:01' }
]

export const fraudEvents = [
  { level: '高', title: '设备 GPS 与手机 GPS 偏差 1.8km', owner: 'OP-10812', region: 'Somali', time: '12分钟前', action: '冻结当日绩效' },
  { level: '中', title: '单小时登记速度超出区域基线 240%', owner: 'OP-11440', region: 'Tigray', time: '41分钟前', action: '主管复核' },
  { level: '低', title: '连续 3 笔生物特征质量低于 60', owner: 'OP-10331', region: 'Oromia', time: '1小时前', action: '记录日志' }
]

export const payrollBatches = [
  { no: 'BAT-20260601-000124', period: '2026-05', amount: 'ETB 462,800', operators: 118, stage: '主管审批', wait: '16h', fraud: 91, status: '待审批' },
  { no: 'BAT-20260601-000125', period: '2026-05', amount: 'ETB 728,900', operators: 184, stage: 'CEO/CFO审批', wait: '8h', fraud: 88, status: '大额审批' },
  { no: 'BAT-20260601-000126', period: '2026-05', amount: 'ETB 188,400', operators: 52, stage: '财务审批', wait: '31h', fraud: 64, status: '需复核' }
]

export const payments = [
  { no: 'BAT-20260501-000098', bank: 'Commercial Bank of Ethiopia', amount: 'ETB 516,200', status: 'PAID', ref: 'CBE-PAY-882193', reconcile: '匹配', retry: 0 },
  { no: 'BAT-20260501-000099', bank: 'Awash Bank', amount: 'ETB 314,780', status: 'PAYING', ref: 'AWB-PAY-382017', reconcile: 'T+1待对账', retry: 0 },
  { no: 'BAT-20260501-000100', bank: 'Dashen Bank', amount: 'ETB 92,440', status: 'FAILED', ref: 'DSH-ERR-0192', reconcile: '差异', retry: 2 }
]

export const auditLogs = [
  { id: 'AUD-781240', user: 'finance.approver', action: 'APPROVE', resource: 'BAT-20260601-000125', ip: '10.8.14.22', hash: '9af1...c02b', time: '2026-06-17 09:12' },
  { id: 'AUD-781241', user: 'sys.admin', action: 'LOCK_DEVICE', resource: 'KIT-FP-0904', ip: '10.8.2.10', hash: 'b03e...a177', time: '2026-06-17 09:18' },
  { id: 'AUD-781242', user: 'auditor.readonly', action: 'EXPORT', resource: 'fraud-events', ip: '10.8.33.7', hash: '37d1...884a', time: '2026-06-17 09:33' },
  { id: 'AUD-781243', user: 'edge-aa-01', action: 'CREATE', resource: 'enrollment-batch', ip: '172.16.1.4', hash: '88bc...431d', time: '2026-06-17 09:40' }
]

export const kpis = [
  { label: '累计登记记录', value: '247,500', delta: '+12.4%', tone: 'good' },
  { label: '活跃操作员', value: '1,034', delta: '+38', tone: 'good' },
  { label: '同步完成率', value: '91.8%', delta: '-2.1%', tone: 'warn' },
  { label: '本月待发薪酬', value: 'ETB 3.42M', delta: '+8.7%', tone: 'good' },
  { label: '异常事件', value: '41', delta: '+9', tone: 'danger' },
  { label: '设备在线率', value: '86.2%', delta: '-4.5%', tone: 'warn' }
]
