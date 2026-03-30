// 档案工作实务 - Archival Work Practice
// 浙江省档案中级考试题库

const shiwu_danxuan = [
  // === 文件材料的收集与归档 ===
  { question: "归档文件整理规则（DA/T 22）中，「件」是指", options: ["A. 归档文件的整理单位","B. 一个案卷","C. 一个全宗","D. 一个保管单位"], answer: "A", explanation: "DA/T 22规定，件是归档文件的整理单位，一般以每份文件为一件。" },
  { question: "文件材料归档的基本要求不包括", options: ["A. 齐全完整","B. 遵循文件形成规律","C. 保持文件之间的有机联系","D. 按照文件的美观程度排列"], answer: "D", explanation: "归档要求齐全完整、遵循形成规律、保持有机联系，不以美观程度为标准。" },
  { question: "机关文件材料归档范围的确定，应以", options: ["A. 领导意见为准","B. 文件的保存价值为准","C. 文件的数量为准","D. 文件的来源为准"], answer: "B", explanation: "归档范围以文件的保存价值为主要依据。" },
  { question: "一般应在次年（）月底前完成上年度归档文件的整理工作", options: ["A. 3","B. 6","C. 9","D. 12"], answer: "B", explanation: "机关档案管理规定要求，一般应在次年6月底前完成上年度归档文件的整理工作。" },
  { question: "公文处理完毕后，应根据（）的有关规定，及时整理归档", options: ["A. 《档案法》","B. 《公文处理工作条例》","C. 机关文件材料归档范围和保管期限表","D. 以上都是"], answer: "C", explanation: "公文处理完毕后应根据归档范围和保管期限表及时整理归档。" },
  { question: "在归档文件整理中，同一事由的请示与批复应", options: ["A. 分别立卷","B. 合并为一件","C. 只保留批复","D. 只保留请示"], answer: "B", explanation: "请示与批复应合并为一件，批复在前，请示在后。" },
  { question: "正文与附件应作为（）处理", options: ["A. 分别立件","B. 一件","C. 两件","D. 视情况而定"], answer: "B", explanation: "正文与附件为一件，不可分开。" },
  { question: "转发文与被转发文应", options: ["A. 各为一件","B. 合为一件","C. 只保留转发文","D. 只保留被转发文"], answer: "B", explanation: "转发文与被转发文合为一件。" },

  // === 档案整理与分类 ===
  { question: "全宗是一个国家机构、社会组织或个人形成的具有（）的档案整体", options: ["A. 历史联系","B. 有机联系","C. 必然联系","D. 物理联系"], answer: "B", explanation: "全宗是具有有机联系的档案整体，这是来源原则的核心体现。" },
  { question: "在档案分类中，（）是最基本的分类方法", options: ["A. 年度分类法","B. 组织机构分类法","C. 问题分类法","D. 以上都可作为基本分类方法"], answer: "D", explanation: "年度、机构、问题分类法均为基本的档案分类方法，各单位可根据实际选择。" },
  { question: "机关档案常用的分类方案组合为", options: ["A. 年度—机构（问题）—保管期限","B. 保管期限—年度—机构","C. 机构—年度—保管期限","D. 问题—保管期限—年度"], answer: "A", explanation: "机关档案常用年度—机构（问题）—保管期限的分类方案。" },
  { question: "归档文件按保管期限分为", options: ["A. 永久、长期、短期","B. 永久、30年、10年","C. 永久、定期","D. 一级、二级、三级"], answer: "B", explanation: "根据新规定，机关文件材料保管期限分为永久、定期（30年、10年）。" },
  { question: "档号是存取档案的（），在档案管理中具有重要作用", options: ["A. 编码","B. 代号","C. 代码","D. 标识"], answer: "D", explanation: "档号是档案的标识，用于存取和管理档案。" },
  { question: "归档文件整理中，装订时应注意将（）装订在一起", options: ["A. 同一件文件的各页","B. 同一类别的文件","C. 同一日期的文件","D. 同一作者的文件"], answer: "A", explanation: "装订是将同一件文件的各页固定在一起的过程。" },
  { question: "案卷题名应简明概括地揭示案卷内文件的（）", options: ["A. 来源","B. 内容和成分","C. 作者","D. 时间"], answer: "B", explanation: "案卷题名应揭示案卷内文件的内容和成分。" },
  { question: "归档文件以（）为单位进行排列", options: ["A. 案卷","B. 件","C. 卷","D. 页"], answer: "B", explanation: "DA/T 22规定以件为单位进行排列。" },

  // === 档案著录与检索 ===
  { question: "档案著录是对档案（）进行分析、选择和记录的过程", options: ["A. 外部特征","B. 内部特征","C. 内容和形式特征","D. 物理特征"], answer: "C", explanation: "档案著录是对档案内容和形式特征进行分析、选择和记录。" },
  { question: "档案著录的基本单元是", options: ["A. 条目","B. 全宗","C. 案卷","D. 件"], answer: "A", explanation: "条目是档案著录的基本单元。" },
  { question: "《档案著录规则》（DA/T 18）规定的著录项目不包括", options: ["A. 题名","B. 责任者","C. 档案价格","D. 日期"], answer: "C", explanation: "著录项目包括题名、责任者、日期、密级等，不包括价格。" },
  { question: "档案检索工具中，（）是最基本、最常用的检索工具", options: ["A. 案卷目录","B. 全引目录","C. 专题目录","D. 分类目录"], answer: "A", explanation: "案卷目录是最基本和最常用的档案检索工具。" },
  { question: "全宗指南属于档案检索工具中的", options: ["A. 目录型检索工具","B. 索引型检索工具","C. 指南型检索工具","D. 文摘型检索工具"], answer: "C", explanation: "全宗指南属于指南型检索工具。" },

  // === 档案鉴定与销毁 ===
  { question: "档案鉴定工作的核心内容是", options: ["A. 确定档案的保管期限","B. 确定档案的密级","C. 确定档案的价值","D. 确定档案的数量"], answer: "C", explanation: "档案鉴定的核心是确定档案的价值。" },
  { question: "档案保管期限表是档案鉴定工作的", options: ["A. 主要依据","B. 参考资料","C. 唯一标准","D. 辅助工具"], answer: "A", explanation: "保管期限表是鉴定工作的主要依据。" },
  { question: "销毁档案必须编制", options: ["A. 移交目录","B. 销毁清册","C. 案卷目录","D. 归档文件目录"], answer: "B", explanation: "销毁档案必须编制销毁清册，经批准后方可执行。" },
  { question: "档案销毁清册应永久保存，由（）负责保管", options: ["A. 销毁部门","B. 档案管理部门","C. 办公室","D. 保密部门"], answer: "B", explanation: "销毁清册由档案管理部门永久保管。" },
  { question: "对已到保管期限的档案进行鉴定时，应", options: ["A. 直接销毁","B. 逐件审查","C. 抽样审查","D. 统一延长期限"], answer: "B", explanation: "鉴定时应逐件审查，确定是否继续保存或销毁。" },

  // === 档案保管与保护 ===
  { question: "档案库房的温度应控制在", options: ["A. 10℃—15℃","B. 14℃—24℃","C. 20℃—30℃","D. 25℃—35℃"], answer: "B", explanation: "档案库房温度标准为14℃—24℃。" },
  { question: "档案库房的相对湿度应控制在", options: ["A. 20%—35%","B. 45%—60%","C. 65%—80%","D. 80%—95%"], answer: "B", explanation: "档案库房相对湿度标准为45%—60%。" },
  { question: "档案库房应具备「八防」条件，以下不属于「八防」的是", options: ["A. 防火","B. 防盗","C. 防地震","D. 防虫"], answer: "C", explanation: "八防是防火、防盗、防潮、防光、防尘、防高温、防虫、防鼠，不含防地震。" },
  { question: "纸质档案修裱的主要方法是", options: ["A. 托裱","B. 装帧","C. 打印","D. 复印"], answer: "A", explanation: "托裱是纸质档案修裱的主要方法。" },
  { question: "档案库房应使用（）照明", options: ["A. 白炽灯","B. 日光灯","C. 无紫外线灯具","D. 任何灯具均可"], answer: "C", explanation: "为防止紫外线对档案的损害，库房应使用无紫外线灯具照明。" },
  { question: "磁性载体档案的存放场所应远离", options: ["A. 光源","B. 强磁场","C. 声源","D. 热源"], answer: "B", explanation: "磁性载体需远离强磁场，以免信息受损。" },

  // === 电子文件与电子档案管理 ===
  { question: "电子档案的「四性」是指", options: ["A. 真实性、完整性、可用性、安全性","B. 准确性、完整性、系统性、安全性","C. 真实性、完整性、可靠性、可用性","D. 原始性、真实性、完整性、有效性"], answer: "A", explanation: "电子档案四性检测指真实性、完整性、可用性、安全性。" },
  { question: "电子文件归档时应同时归档相应的", options: ["A. 元数据","B. 原始设备","C. 操作手册","D. 技术人员名单"], answer: "A", explanation: "电子文件归档时必须同时归档相应的元数据。" },
  { question: "电子档案的长期保存格式推荐使用", options: ["A. DOC","B. PDF/A","C. JPG","D. PPT"], answer: "B", explanation: "PDF/A是专门为电子档案长期保存设计的标准格式。" },
  { question: "电子档案备份应至少制作（）份", options: ["A. 1","B. 2","C. 3","D. 4"], answer: "C", explanation: "电子档案应至少制作3份备份，实行异地异质备份。" },
  { question: "以下关于电子签名的说法正确的是", options: ["A. 电子签名不具有法律效力","B. 可靠的电子签名与手写签名具有同等法律效力","C. 电子签名只能用于个人文件","D. 电子签名不能用于档案管理"], answer: "B", explanation: "根据《电子签名法》，可靠的电子签名与手写签名具有同等法律效力。" },
  { question: "OFD格式是我国自主研发的", options: ["A. 图像格式","B. 音频格式","C. 版式文档格式","D. 数据库格式"], answer: "C", explanation: "OFD（Open Fixed-layout Document）是我国自主研发的版式文档格式标准。" },
  { question: "电子文件元数据主要用于", options: ["A. 美化文件","B. 描述、管理和利用电子文件","C. 加密文件","D. 压缩文件"], answer: "B", explanation: "元数据用于描述、管理和利用电子文件。" },

  // === 档案数字化 ===
  { question: "纸质档案数字化的基本流程正确的是", options: ["A. 扫描—整理—著录—验收","B. 档案整理—扫描加工—图像处理—质量检查","C. 拍照—录入—检查—入库","D. 编号—扫描—打印—归档"], answer: "B", explanation: "纸质档案数字化基本流程为：档案整理→扫描加工→图像处理→质量检查。" },
  { question: "纸质档案扫描时，分辨率一般不低于", options: ["A. 72dpi","B. 150dpi","C. 300dpi","D. 600dpi"], answer: "C", explanation: "纸质档案扫描分辨率一般不低于300dpi。" },
  { question: "档案数字化成果应实行", options: ["A. 单套制管理","B. 双套制管理","C. 按需管理","D. 不需要管理"], answer: "B", explanation: "档案数字化成果通常实行双套制管理，纸质与数字副本并存。" },
  { question: "OCR技术在档案数字化中主要用于", options: ["A. 图像美化","B. 文字识别","C. 格式转换","D. 数据压缩"], answer: "B", explanation: "OCR（光学字符识别）主要用于将扫描图像中的文字转化为可编辑文本。" },

  // === 档案统计与编研 ===
  { question: "档案统计工作的基本内容包括", options: ["A. 档案数量统计和利用效果统计","B. 只包括数量统计","C. 只包括利用统计","D. 只包括经费统计"], answer: "A", explanation: "档案统计工作包括档案数量统计和利用效果统计等内容。" },
  { question: "档案编研的成果形式不包括", options: ["A. 大事记","B. 组织沿革","C. 文件汇编","D. 小说创作"], answer: "D", explanation: "大事记、组织沿革、文件汇编是档案编研的成果形式，小说创作不属于。" },
  { question: "全宗卷主要记录", options: ["A. 全宗内档案的管理历史","B. 个人简历","C. 机构财务情况","D. 员工考勤"], answer: "A", explanation: "全宗卷记录全宗内档案的管理、变动、鉴定等历史情况。" },
  { question: "组织沿革属于", options: ["A. 参考资料类编研成果","B. 文件汇编类编研成果","C. 史料类编研成果","D. 工具书类编研成果"], answer: "A", explanation: "组织沿革属于参考资料类编研成果。" },

  // === 专门档案 ===
  { question: "会计档案的保管期限从（）算起", options: ["A. 文件形成之日","B. 会计年度终了后的第一天","C. 移交档案室之日","D. 审计完成之日"], answer: "B", explanation: "会计档案保管期限从会计年度终了后的第一天算起。" },
  { question: "科技档案的基本保管单位是", options: ["A. 件","B. 案卷","C. 全宗","D. 项目"], answer: "B", explanation: "科技档案的基本保管单位是案卷。" },
  { question: "人事档案管理的原则是", options: ["A. 公开透明","B. 集中统一、归口管理","C. 各部门自行管理","D. 个人自行保管"], answer: "B", explanation: "人事档案实行集中统一、归口管理的原则。" },
  { question: "基本建设项目档案应在项目（）时归档", options: ["A. 立项","B. 施工过程中","C. 竣工验收","D. 运行一年后"], answer: "C", explanation: "基建项目档案应在项目竣工验收时归档。" },
  { question: "照片档案应采用（）方式存放", options: ["A. 叠放","B. 竖立放置或平放于专用照片册","C. 随意摆放","D. 与纸质档案混放"], answer: "B", explanation: "照片档案应竖立放置或平放于专用照片册中。" },
  { question: "声像档案包括", options: ["A. 照片、录音、录像等","B. 只包括照片","C. 只包括录像","D. 只包括录音"], answer: "A", explanation: "声像档案包括照片、录音、录像等多种载体。" },

  // === 机关档案工作 ===
  { question: "机关档案工作的基本任务是", options: ["A. 收集整理保管档案，为机关工作服务","B. 编写机关历史","C. 管理机关财务","D. 人事管理"], answer: "A", explanation: "机关档案工作基本任务是收集、整理、保管、利用档案，为机关各项工作服务。" },
  { question: "《机关档案管理规定》要求机关应设立（）负责档案工作", options: ["A. 档案室","B. 档案馆","C. 综合档案部门","D. 档案局"], answer: "A", explanation: "《机关档案管理规定》要求机关应设立档案室负责档案工作。" },
  { question: "机关档案室向档案馆移交档案的期限，一般为文件形成后满（）年", options: ["A. 5","B. 10","C. 15","D. 20"], answer: "B", explanation: "一般在文件形成后满10年向同级国家综合档案馆移交。" },
  { question: "档案移交时应编制", options: ["A. 销毁清册","B. 移交目录","C. 索引","D. 大事记"], answer: "B", explanation: "档案移交时必须编制移交目录，一式两份，双方签字。" },
];

const shiwu_duoxuan = [
  // === 多选题 ===
  { question: "归档文件整理的基本原则包括", options: ["A. 遵循文件形成规律","B. 保持文件之间的有机联系","C. 区分不同价值","D. 便于保管和利用"], answer: "ABCD", explanation: "归档文件整理遵循形成规律、保持有机联系、区分价值、便于保管利用。", type: "multi" },
  { question: "下列属于归档文件整理中「件」的组合方式的有", options: ["A. 正文与附件为一件","B. 请示与批复为一件","C. 转发文与被转发文为一件","D. 报告与通知为一件"], answer: "ABC", explanation: "正文附件、请示批复、转发文与被转发文分别合为一件，报告与通知通常不合。", type: "multi" },
  { question: "档案整理的基本分类方法有", options: ["A. 年度分类法","B. 组织机构分类法","C. 问题分类法","D. 价格分类法"], answer: "ABC", explanation: "年度、组织机构、问题分类法是三种基本分类方法。", type: "multi" },
  { question: "保管期限的划分档次为", options: ["A. 永久","B. 30年","C. 10年","D. 5年"], answer: "ABC", explanation: "现行规定保管期限分为永久、30年、10年三个档次。", type: "multi" },
  { question: "档案鉴定委员会一般由（）组成", options: ["A. 分管领导","B. 档案部门负责人","C. 相关业务部门人员","D. 档案管理人员"], answer: "ABCD", explanation: "鉴定委员会由分管领导、档案部门负责人、业务部门人员和档案管理人员组成。", type: "multi" },
  { question: "档案销毁应遵循的程序包括", options: ["A. 编制销毁清册","B. 领导审批","C. 指定专人监销","D. 在销毁清册上签名"], answer: "ABCD", explanation: "销毁须编制清册、领导审批、专人监销、签名确认。", type: "multi" },
  { question: "档案库房「八防」包括", options: ["A. 防火、防盗、防潮","B. 防光、防尘","C. 防高温、防虫","D. 防鼠"], answer: "ABCD", explanation: "八防为防火、防盗、防潮、防光、防尘、防高温、防虫、防鼠。", type: "multi" },
  { question: "电子档案四性检测的内容包括", options: ["A. 真实性","B. 完整性","C. 可用性","D. 安全性"], answer: "ABCD", explanation: "电子档案四性为真实性、完整性、可用性、安全性。", type: "multi" },
  { question: "以下属于档案检索工具的有", options: ["A. 案卷目录","B. 全引目录","C. 专题目录","D. 全宗指南"], answer: "ABCD", explanation: "案卷目录、全引目录、专题目录、全宗指南均属于档案检索工具。", type: "multi" },
  { question: "档案著录的主要项目包括", options: ["A. 题名","B. 责任者","C. 日期","D. 保管期限"], answer: "ABCD", explanation: "题名、责任者、日期、保管期限等均为著录的主要项目。", type: "multi" },
  { question: "电子文件归档应包括", options: ["A. 电子文件本身","B. 元数据","C. 电子签名","D. 相关附件"], answer: "ABD", explanation: "电子文件归档包括文件本身、元数据和相关附件，电子签名是文件的组成部分。", type: "multi" },
  { question: "档案数字化质量控制的环节有", options: ["A. 扫描质量检查","B. 图像处理质量检查","C. 著录质量检查","D. 挂接质量检查"], answer: "ABCD", explanation: "数字化质量控制贯穿扫描、图像处理、著录、挂接等各环节。", type: "multi" },
  { question: "纸质档案数字化的图像处理包括", options: ["A. 纠偏","B. 去污","C. 裁边","D. 色彩调整"], answer: "ABCD", explanation: "图像处理包括纠偏、去污、裁边、色彩调整等操作。", type: "multi" },
  { question: "档案编研成果的类型包括", options: ["A. 文件汇编","B. 大事记","C. 组织沿革","D. 基础数字汇集"], answer: "ABCD", explanation: "文件汇编、大事记、组织沿革、基础数字汇集均为编研成果类型。", type: "multi" },
  { question: "档案统计的主要内容有", options: ["A. 档案数量","B. 库房面积","C. 利用情况","D. 工作人员情况"], answer: "ABCD", explanation: "档案统计涵盖数量、库房、利用、人员等多方面。", type: "multi" },
  { question: "以下属于特殊载体档案的有", options: ["A. 照片档案","B. 录音档案","C. 录像档案","D. 实物档案"], answer: "ABCD", explanation: "照片、录音、录像、实物均属特殊载体档案。", type: "multi" },
  { question: "会计档案包括", options: ["A. 会计凭证","B. 会计账簿","C. 财务会计报告","D. 其他会计资料"], answer: "ABCD", explanation: "会计档案包括凭证、账簿、报告及其他会计资料。", type: "multi" },
  { question: "科技档案的种类包括", options: ["A. 科研档案","B. 基建档案","C. 设备档案","D. 产品档案"], answer: "ABCD", explanation: "科技档案包括科研、基建、设备、产品等类型。", type: "multi" },
  { question: "档案信息化建设的主要内容包括", options: ["A. 档案管理系统建设","B. 档案数字化","C. 数字档案馆建设","D. 档案信息安全保障"], answer: "ABCD", explanation: "信息化建设包括管理系统、数字化、数字档案馆、信息安全等。", type: "multi" },
  { question: "档案移交手续应包括", options: ["A. 编制移交目录","B. 清点核对档案","C. 双方签字盖章","D. 出具移交凭证"], answer: "ABCD", explanation: "移交时应编目录、清点核对、双方签章、出具凭证。", type: "multi" },
  { question: "机关档案室的基本职责包括", options: ["A. 收集本单位各类档案","B. 整理保管档案","C. 开展档案利用服务","D. 按期向档案馆移交"], answer: "ABCD", explanation: "档案室职责为收集、整理、保管、利用和按期移交。", type: "multi" },
  { question: "以下属于电子档案长期保存格式的有", options: ["A. PDF/A","B. OFD","C. TIFF","D. XML"], answer: "ABCD", explanation: "PDF/A、OFD、TIFF、XML均可用于电子档案长期保存。", type: "multi" },
  { question: "档案安全体系建设包括", options: ["A. 制度安全","B. 实体安全","C. 信息安全","D. 应急管理"], answer: "ABCD", explanation: "档案安全体系涵盖制度、实体、信息安全和应急管理。", type: "multi" },
  { question: "归档文件目录应包含的项目有", options: ["A. 件号","B. 责任者","C. 题名","D. 日期"], answer: "ABCD", explanation: "归档文件目录包含件号、责任者、题名、日期等项目。", type: "multi" },
  { question: "档案保管的基本要求包括", options: ["A. 以防为主","B. 防治结合","C. 定期检查","D. 及时处理"], answer: "ABCD", explanation: "档案保管要求以防为主、防治结合、定期检查、及时处理。", type: "multi" },
  { question: "下列属于档案利用方式的有", options: ["A. 查阅","B. 复制","C. 借出","D. 网络查询"], answer: "ABCD", explanation: "查阅、复制、借出、网络查询均为档案利用方式。", type: "multi" },
  { question: "企业档案管理的特点包括", options: ["A. 档案类型多样","B. 涉及商业秘密","C. 与生产经营密切相关","D. 保管期限特殊"], answer: "ABCD", explanation: "企业档案类型多样、涉及商业秘密、与经营相关、期限特殊。", type: "multi" },
  { question: "档案工作标准化的内容包括", options: ["A. 业务标准","B. 技术标准","C. 管理标准","D. 术语标准"], answer: "ABCD", explanation: "档案标准化包括业务、技术、管理、术语等方面的标准。", type: "multi" },
  { question: "影响纸质档案寿命的因素有", options: ["A. 温湿度","B. 光照","C. 有害气体","D. 生物因素"], answer: "ABCD", explanation: "温湿度、光照、有害气体、生物因素（霉菌、害虫）均影响纸质档案寿命。", type: "multi" },
  { question: "全宗卷的内容应包括", options: ["A. 全宗介绍","B. 档案交接记录","C. 鉴定记录","D. 分类方案"], answer: "ABCD", explanation: "全宗卷包括全宗介绍、交接记录、鉴定记录、分类方案等内容。", type: "multi" },
];

const shiwu_panduan = [
  // === 判断题 ===
  { question: "归档文件应以「件」为单位进行整理", options: ["正确","错误"], answer: "A", explanation: "根据DA/T 22，归档文件以件为单位进行整理。", type: "tf" },
  { question: "请示与批复可以分别作为两件进行整理", options: ["正确","错误"], answer: "B", explanation: "请示与批复应合并为一件，批复在前，请示在后。", type: "tf" },
  { question: "文件的正文与附件应分别立件", options: ["正确","错误"], answer: "B", explanation: "正文与附件合为一件，不可分开。", type: "tf" },
  { question: "机关文件材料保管期限分为永久和定期两种", options: ["正确","错误"], answer: "A", explanation: "保管期限分为永久和定期（30年、10年）。", type: "tf" },
  { question: "归档文件可以不编制页号", options: ["正确","错误"], answer: "B", explanation: "永久、定期30年的归档文件应编制页号。", type: "tf" },
  { question: "档号是唯一标识档案的编号", options: ["正确","错误"], answer: "A", explanation: "档号是档案的唯一标识。", type: "tf" },
  { question: "案卷目录是最常用的档案检索工具", options: ["正确","错误"], answer: "A", explanation: "案卷目录是最基本、最常用的检索工具。", type: "tf" },
  { question: "档案著录只需记录档案的外部特征即可", options: ["正确","错误"], answer: "B", explanation: "档案著录需记录内容和形式两方面的特征。", type: "tf" },
  { question: "档案鉴定工作应由档案部门单独完成", options: ["正确","错误"], answer: "B", explanation: "档案鉴定应由鉴定委员会组织，包括分管领导、业务部门等共同参与。", type: "tf" },
  { question: "销毁档案可以不编制销毁清册", options: ["正确","错误"], answer: "B", explanation: "销毁档案必须编制销毁清册。", type: "tf" },
  { question: "档案库房温度标准为14℃—24℃", options: ["正确","错误"], answer: "A", explanation: "档案库房温度标准为14℃—24℃。", type: "tf" },
  { question: "档案库房相对湿度标准为45%—60%", options: ["正确","错误"], answer: "A", explanation: "档案库房相对湿度标准为45%—60%。", type: "tf" },
  { question: "磁性载体档案可以与纸质档案存放在同一库房", options: ["正确","错误"], answer: "B", explanation: "磁性载体档案应单独存放，远离强磁场。", type: "tf" },
  { question: "电子档案不需要进行四性检测", options: ["正确","错误"], answer: "B", explanation: "电子档案必须进行真实性、完整性、可用性、安全性四性检测。", type: "tf" },
  { question: "电子文件归档时只需保存文件本身即可", options: ["正确","错误"], answer: "B", explanation: "电子文件归档时应同时保存文件本身和相应元数据。", type: "tf" },
  { question: "PDF/A是电子档案长期保存的推荐格式", options: ["正确","错误"], answer: "A", explanation: "PDF/A是专门为电子档案长期保存设计的格式。", type: "tf" },
  { question: "纸质档案扫描分辨率一般不低于300dpi", options: ["正确","错误"], answer: "A", explanation: "纸质档案扫描分辨率标准为不低于300dpi。", type: "tf" },
  { question: "档案数字化后可以立即销毁纸质原件", options: ["正确","错误"], answer: "B", explanation: "数字化后纸质原件不能随意销毁，应按规定保管。", type: "tf" },
  { question: "OCR技术可以将扫描图像中的文字转为可编辑文本", options: ["正确","错误"], answer: "A", explanation: "OCR（光学字符识别）的作用就是将图像文字转为可编辑文本。", type: "tf" },
  { question: "大事记属于档案编研成果", options: ["正确","错误"], answer: "A", explanation: "大事记是常见的档案编研成果形式。", type: "tf" },
  { question: "全宗卷只需记录档案的数量变化", options: ["正确","错误"], answer: "B", explanation: "全宗卷应记录管理历史、交接、鉴定、分类方案等全面信息。", type: "tf" },
  { question: "会计档案的保管期限从文件形成之日起计算", options: ["正确","错误"], answer: "B", explanation: "会计档案保管期限从会计年度终了后的第一天算起。", type: "tf" },
  { question: "科技档案的基本保管单位是案卷", options: ["正确","错误"], answer: "A", explanation: "科技档案以案卷为基本保管单位。", type: "tf" },
  { question: "人事档案可以由个人自行保管", options: ["正确","错误"], answer: "B", explanation: "人事档案实行集中统一、归口管理，不能个人自行保管。", type: "tf" },
  { question: "照片档案应与纸质档案混合存放", options: ["正确","错误"], answer: "B", explanation: "照片档案应单独存放于专用照片册或档案盒中。", type: "tf" },
  { question: "机关档案室应在文件形成后满10年向档案馆移交", options: ["正确","错误"], answer: "A", explanation: "一般在文件形成后满10年向同级国家综合档案馆移交。", type: "tf" },
  { question: "档案移交时可以不编制移交目录", options: ["正确","错误"], answer: "B", explanation: "档案移交必须编制移交目录。", type: "tf" },
  { question: "机关档案工作的基本任务是为机关各项工作服务", options: ["正确","错误"], answer: "A", explanation: "机关档案工作的基本任务是收集、整理、保管、利用档案，为机关各项工作服务。", type: "tf" },
  { question: "电子档案应至少制作3份备份", options: ["正确","错误"], answer: "A", explanation: "电子档案应至少制作3份备份，实行异地异质备份策略。", type: "tf" },
  { question: "档案数字化可以外包给任何公司", options: ["正确","错误"], answer: "B", explanation: "档案数字化外包应选择有资质的机构，并签订保密协议，做好安全管理。", type: "tf" },
  { question: "归档文件排列时，同一事由的文件应排列在一起", options: ["正确","错误"], answer: "A", explanation: "同一事由的文件应集中排列，便于利用。", type: "tf" },
  { question: "档案工作标准化仅包括技术标准", options: ["正确","错误"], answer: "B", explanation: "档案标准化包括业务标准、技术标准、管理标准、术语标准等。", type: "tf" },
  { question: "电子签名与手写签名具有同等法律效力", options: ["正确","错误"], answer: "A", explanation: "根据《电子签名法》，可靠的电子签名与手写签名具有同等法律效力。", type: "tf" },
  { question: "OFD是国际通用的文档格式标准", options: ["正确","错误"], answer: "B", explanation: "OFD是我国自主研发的版式文档格式标准，不是国际通用标准。", type: "tf" },
  { question: "档案利用登记是档案管理的重要环节", options: ["正确","错误"], answer: "A", explanation: "档案利用登记有助于统计和分析档案利用情况，是管理的重要环节。", type: "tf" },
  { question: "企业档案只包括行政管理类文件", options: ["正确","错误"], answer: "B", explanation: "企业档案类型多样，包括行政、财务、人事、科技、产品等各类档案。", type: "tf" },
  { question: "数字档案馆建设不需要考虑信息安全问题", options: ["正确","错误"], answer: "B", explanation: "数字档案馆建设必须高度重视信息安全保障。", type: "tf" },
  { question: "归档文件目录应包括件号、责任者、题名、日期等项目", options: ["正确","错误"], answer: "A", explanation: "归档文件目录的基本项目包括件号、责任者、题名、日期等。", type: "tf" },
  { question: "档案保管应以防为主、防治结合", options: ["正确","错误"], answer: "A", explanation: "档案保管工作的基本原则是以防为主、防治结合。", type: "tf" },
  { question: "基建项目档案可以在项目竣工后随时归档", options: ["正确","错误"], answer: "B", explanation: "基建项目档案应在竣工验收时及时归档，不能随时拖延。", type: "tf" },
];

module.exports = { shiwu_danxuan, shiwu_duoxuan, shiwu_panduan };
