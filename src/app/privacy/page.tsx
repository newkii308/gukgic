import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | GUKGIC Social App',
  description: 'Privacy policy and data protection principles for GUKGIC social application.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-dark-card text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span>ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ (Privacy Policy)</span>
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 2026 • GUKGIC Platform</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-6 sm:p-8 space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">1. ຂໍ້ມູນທີ່ພວກເຮົາເກັບຮວບຮວມ (Information We Collect)</h2>
          <p>
            GUKGIC ໃຫ້ຄວາມສຳຄັນກັບຄວາມເປັນສ່ວນຕົວຂອງຜູ້ໃຊ້ສູງສຸດ. ພວກເຮົາເກັບຮວບຮວມສະເພາະຂໍ້ມູນທີ່ຈຳເປັນໃນການໃຫ້ບໍລິການ:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>ຂໍ້ມູນໂປຣໄຟລ໌: ຊື່ສະແດງ, Username, Bio, ຮູບພາບໂປຣໄຟລ໌, ແລະ ຄວາມສົນໃຈ</li>
            <li>ຂໍ້ມູນການສື່ສານ: ຂໍ້ຄວາມແຊັດ ແລະ ຂໍ້ຄວາມສຽງທີ່ຖືກສົ່ງລະຫວ່າງເພື່ອນ</li>
            <li>ການຕັ້ງຄ່າ: ພາສາ ແລະ Theme ທີ່ເລືອກໄວ້ໃນເຄື່ອງ</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">2. ການປົກປ້ອງຂໍ້ມູນ ແລະ ຄວາມປອດໄພ (Data Security)</h2>
          <p>
            ລະຫັດຜ່ານທັງໝົດຈະຖືກ Hash ດ້ວຍມາດຕະຖານ Bcrypt ກ່ອນການບັນທຶກ ແລະ ການສົ່ງຂໍ້ມູນທັງໝົດຜ່ານ HTTPS / WebSocket Secure (WSS). ພວກເຮົາບໍ່ເຄີຍຂາຍຂໍ້ມູນສ່ວນຕົວຂອງທ່ານໃຫ້ກັບບຸກຄົນທີສາມ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">3. ສິດທິໃນການຄວບຄຸມຂໍ້ມູນຂອງທ່ານ (Your Rights)</h2>
          <p>
            ທ່ານສາມາດປັບແຕ່ງຄວາມເປັນສ່ວນຕົວ (Privacy Settings), ເລືອກວ່າໃຜສາມາດເບິ່ງໂປຣໄຟລ໌ຂອງທ່ານ ຫຼື ບລັອກຜູ້ໃຊ້ອື່ນໆໄດ້ຕະຫຼອດເວລາຜ່ານເມນູ Settings.
          </p>
        </section>
      </div>
    </div>
  );
}
