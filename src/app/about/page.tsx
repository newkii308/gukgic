import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Heart, Users, Smartphone, Shield } from 'lucide-react';

export const metadata = {
  title: 'About & Community Guidelines | GUKGIC Social App',
  description: 'Learn about GUKGIC social app and our community guidelines for Lao Gen Z.',
};

export default function AboutPage() {
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
            <Sparkles className="w-6 h-6 text-primary-500" />
            <span>ກ່ຽວກັບ GUKGIC (About & Guidelines)</span>
          </h1>
          <p className="text-xs text-slate-400">The Modern Social App for Lao Gen Z</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>ພາລະກິດຂອງພວກເຮົາ (Our Mission)</span>
          </h2>
          <p>
            <strong>GUKGIC</strong> ຖືກສ້າງຂຶ້ນມາເພື່ອເປັນພື້ນທີ່ສຳລັບຄົນຮຸ່ນໃໝ່ໃນລາວ ທີ່ຕ້ອງການຊອກຫາເພື່ອນໃໝ່ ທີ່ມີຄວາມມັກ ແລະ Life Style ຄືກັນ ບໍ່ວ່າຈະເປັນສາຍກາເຟ, ສາຍຖ່າຍຮູບ, ສາຍດົນຕີ, ສາຍເກມ ຫຼື ສາຍທ່ຽວທຳມະຊາດ.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>ກົດລະບຽບຊຸມຊົນ (Community Guidelines)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-dark-text text-xs">✨ ເປັນມິດ ແລະ ໃຫ້ກຽດກັນ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ລົມກັນດ້ວຍຄວາມສຸພາບ ແລະ ເປີດໃຈຮັບຟັງຄວາມຄິດເຫັນທີ່ຫຼາກຫຼາຍ.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-dark-text text-xs">🛡️ ພື້ນທີ່ປອດໄພ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ບໍ່ມີພື້ນທີ່ສຳລັບການບູລີ່, ການຄຸກຄາມ ຫຼື ການຫຼອກລວງທຸກຮູບແບບ.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-dark-text text-xs">📸 ແບ່ງປັນສິ່ງທີ່ສ້າງສັນ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ໂພສຮູບພາບ ແລະ ເລື່ອງລາວທີ່ທ່ານມັກຢ່າງອິດສະຫຼະ ແລະ ມີມາລະຍາດ.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-elevated space-y-1.5">
              <h3 className="font-bold text-slate-900 dark:text-dark-text text-xs">🚩 ຊ່ວຍກັນລາຍງານ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ຫາກພົບເຫັນເນື້ອຫາທີ່ບໍ່ເໝາະສົມ ສາມາດກົດ Report ໄດ້ທັນທີ.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">📱 ເທັກໂນໂລຢີ ແລະ ການພັດທະນາ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ພັດທະນາດ້ວຍ Next.js 14 App Router, WebSocket Realtime Engine, Tailwind CSS, ແລະ ອອກແບບໂຄງສ້າງຮອງຮັບ Capacitor ສຳລັບ iOS ແລະ Android.
          </p>
        </section>
      </div>
    </div>
  );
}
