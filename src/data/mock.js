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

export const dataClassificationRules = [
  { field: 'full_name', category: '个人身份信息', level: 'L2 内部敏感', masking: '姓名首尾保留', supervisor: '明文', finance: '脱敏', auditor: '脱敏', retention: '10年' },
  { field: 'national_id', category: '法定证件号', level: 'L3 高敏', masking: '仅显示后4位', supervisor: '脱敏', finance: '脱敏', auditor: '脱敏', retention: '10年' },
  { field: 'biometric_template', category: '生物特征模板', level: 'L4 受限', masking: '不可逆摘要', supervisor: '不可见', finance: '不可见', auditor: '摘要', retention: '任务完成+法定期' },
  { field: 'gps_trace', category: '位置轨迹', level: 'L3 高敏', masking: '区域栅格化', supervisor: '区域级', finance: '不可见', auditor: '区域级', retention: '18个月' },
  { field: 'bank_account', category: '收款账户', level: 'L4 受限', masking: '银行+后4位', supervisor: '不可见', finance: '脱敏', auditor: '脱敏', retention: '7年' }
]

export const subjectRequests = [
  { id: 'DSR-20260619-014', citizen: 'ETH-****-7291', type: '查询个人数据', region: 'Oromia', channel: '现场服务台', sla: '18h', stage: '主管核验', status: '处理中', owner: 'Mekdes Haile' },
  { id: 'DSR-20260619-015', citizen: 'ETH-****-1844', type: '更正登记地址', region: 'Addis Ababa', channel: '热线转办', sla: '30h', stage: '区域复核', status: '待审批', owner: 'Dawit Tola' },
  { id: 'DSR-20260618-098', citizen: 'ETH-****-5520', type: '删除过期附件', region: 'Somali', channel: '移动端申请', sla: '6h', stage: '隐私官终审', status: '临近超时', owner: 'Privacy Officer' },
  { id: 'DSR-20260617-071', citizen: 'ETH-****-3308', type: '撤回知情同意', region: 'Tigray', channel: '现场服务台', sla: '已完成', stage: '已归档', status: '已完成', owner: 'Audit Bot' }
]

export const consentStats = [
  { label: '今日同意记录', value: '18,420', delta: '+6.8%', tone: 'good' },
  { label: '待补签声明', value: '126', delta: '-22', tone: 'warn' },
  { label: '撤回申请', value: '14', delta: '+3', tone: 'danger' }
]

export const fieldTasks = [
  { id: 'TASK-OR-0620-18', region: 'Oromia East', areaLevel: 'L2 普通偏远', urgency: '加急', target: 90, assigned: 4, claimed: 2, progress: 64, price: 'ETB 1,755', status: '执行中', quality: 86, coverage: '78%' },
  { id: 'TASK-SM-0620-03', region: 'Somali Rural', areaLevel: 'L3 边远艰苦', urgency: '紧急', target: 60, assigned: 2, claimed: 1, progress: 41, price: 'ETB 3,600', status: '待抢单', quality: 82, coverage: '52%' },
  { id: 'TASK-AA-0620-11', region: 'Addis Ababa', areaLevel: 'L1 城市近郊', urgency: '常规', target: 120, assigned: 6, claimed: 0, progress: 88, price: 'ETB 1,200', status: '执行中', quality: 91, coverage: '96%' },
  { id: 'TASK-TG-0619-07', region: 'Tigray North', areaLevel: 'L3 边远艰苦', urgency: '加急', target: 45, assigned: 1, claimed: 2, progress: 100, price: 'ETB 2,925', status: '待结算', quality: 77, coverage: '84%' }
]

export const pricingRules = [
  { level: 'L1 城市近郊', coefficient: 'x1.0', base: 'ETB 300 / 30人', urgent: 'x1.0 常规', settlement: '质量>=80 全额' },
  { level: 'L2 普通偏远', coefficient: 'x1.5', base: 'ETB 450 / 30人', urgent: 'x1.3 加急', settlement: '60-79 八折' },
  { level: 'L3 边远艰苦', coefficient: 'x3.0', base: 'ETB 900 / 30人', urgent: 'x2.0 紧急', settlement: '<60 五折+复核' }
]

export const reputationRows = [
  { operator: 'OP-10024', name: 'Amanuel Tesfaye', regularRate: '96%', bidCount: 1, reputation: 94, eligibility: '可抢单', warning: '无' },
  { operator: 'OP-10331', name: 'Hana Bekele', regularRate: '83%', bidCount: 1, reputation: 87, eligibility: '可抢单', warning: '质量观察' },
  { operator: 'OP-10812', name: 'Yared Alemu', regularRate: '76%', bidCount: 0, reputation: 62, eligibility: '限制抢单', warning: '常规完成率<80%' },
  { operator: 'OP-11440', name: 'Abel Girma', regularRate: '91%', bidCount: 1, reputation: 79, eligibility: '需主管确认', warning: '近3次质量波动' }
]

export const appReleases = [
  { version: '2.8.4', region: 'Addis Ababa', rollout: 20, channel: '灰度', status: '进行中', force: '否', bug: '低', online: '18,420 / 92,100', updated: '2026-06-19 09:30' },
  { version: '2.8.3', region: 'Oromia', rollout: 100, channel: '稳定版', status: '已完成', force: '否', bug: '低', online: '68,220 / 68,430', updated: '2026-06-18 18:10' },
  { version: '2.8.2', region: 'Somali', rollout: 0, channel: '回滚保留', status: '可回滚', force: '否', bug: '中', online: '17,650 / 17,650', updated: '2026-06-17 21:44' },
  { version: '2.7.9', region: 'Tigray', rollout: 100, channel: '强制升级', status: '待联网提示', force: '是', bug: '严重', online: '14,880 / 20,480', updated: '2026-06-19 07:12' }
]

export const healthChecks = [
  { service: 'api-gateway', live: 'UP', ready: 'UP', p99: '182ms', errorRate: '0.03%', saturation: 41, alert: '正常' },
  { service: 'enrollment-service', live: 'UP', ready: 'UP', p99: '436ms', errorRate: '0.12%', saturation: 58, alert: '正常' },
  { service: 'fraud-service', live: 'UP', ready: 'DEGRADED', p99: '1,740ms', errorRate: '1.80%', saturation: 82, alert: '降级' },
  { service: 'sync-service', live: 'UP', ready: 'UP', p99: '620ms', errorRate: '0.44%', saturation: 63, alert: '观察' },
  { service: 'payment-service', live: 'UP', ready: 'UP', p99: '510ms', errorRate: '0.09%', saturation: 36, alert: '正常' }
]

export const alertRules = [
  { id: 'ALR-001', metric: 'fraud.p99_latency', threshold: '> 2000ms / 5m', severity: '高', route: 'SRE + Regional Manager', status: '已启用' },
  { id: 'ALR-002', metric: 'sync.pending_records', threshold: '> 2000 / region', severity: '中', route: 'Edge Ops', status: '已启用' },
  { id: 'ALR-003', metric: 'payment.failed_rate', threshold: '> 2% / 15m', severity: '高', route: 'Finance + SRE', status: '已启用' },
  { id: 'ALR-004', metric: 'db.replication_lag', threshold: '> 30s / 3m', severity: '中', route: 'DBA', status: '维护静默' }
]

export const incentiveRules = [
  { id: 'INC-BASE-001', name: '基础登记单价', version: 'v2026.06', condition: '质量评分 >= 80', formula: 'ETB 10 / record', status: '已启用', impact: '高质量记录全额计薪' },
  { id: 'INC-QUALITY-002', name: '质量阶梯奖金', version: 'v2026.06', condition: '月均质量 >= 90', formula: '+12% bonus', status: '已启用', impact: '提升生物特征质量' },
  { id: 'INC-REMOTE-003', name: '偏远地区补贴', version: 'v2026.06', condition: '区域等级 L2/L3', formula: 'x1.5 / x3.0', status: '已启用', impact: '匹配差异化定价' },
  { id: 'INC-PENALTY-004', name: '低质量扣减', version: 'v2026.05', condition: '质量 < 60 或重复登记', formula: '-50% + 主管复核', status: '草稿', impact: '防止低质刷量' }
]

export const serviceCatalog = [
  { name: 'auth-service', owner: 'IAM Team', sla: '99.95%', api: '/health/ready', note: 'OIDC、MFA、离线 JWT 签发' },
  { name: 'operator-service', owner: 'Workforce Team', sla: '99.90%', api: '/operators', note: '操作员入职、资质、状态流转' },
  { name: 'kit-service', owner: 'Device Team', sla: '99.90%', api: '/kits', note: '设备台账、证书、远程锁定' },
  { name: 'enrollment-service', owner: 'Enrollment Team', sla: '99.90%', api: '/enrollments', note: '去重、质量评分、主库写入' },
  { name: 'sync-service', owner: 'Edge Team', sla: '99.90%', api: '/sync/queues', note: 'WAL、ACK、断点续传' },
  { name: 'incentive-service', owner: 'WFOS Team', sla: '99.80%', api: '/incentive/rules', note: '版本化薪酬规则计算' },
  { name: 'workflow-service', owner: 'Finance Platform', sla: '99.80%', api: '/approvals', note: '多级审批、阈值流转' },
  { name: 'payment-service', owner: 'Finance Platform', sla: '99.80%', api: '/payments', note: 'ISO 20022、银行适配、幂等' },
  { name: 'fraud-service', owner: 'Risk Team', sla: '99.90%', api: '/fraud/score', note: '支付前硬阻断、异常检测' },
  { name: 'audit-service', owner: 'Security Team', sla: '99.95%', api: '/audit/search', note: '链式哈希、ES 检索、导出' },
  { name: 'geospatial-service', owner: 'GIS Team', sla: '99.50%', api: '/geo/coverage', note: '热力图、覆盖率、可达性' },
  { name: 'notification-service', owner: 'Platform Team', sla: '99.50%', api: '/notifications', note: 'App 推送、短信、告警通知' }
]
