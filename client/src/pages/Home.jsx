import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Shield,
  Trophy,
  ArrowRight,
  Layout,
  BarChart,
  Server,
} from "lucide-react";
import useUiStore from "../store/useUiStore";
import useAuthStore from "../store/useAuthStore";

// Assets
import editorDark from "../assets/images/editorDark.png";
import editorLight from "../assets/images/editorLight.png";
import problemListDark from "../assets/images/problemListDark.png";
import problemListLight from "../assets/images/problemListLight.png";
import profileDark from "../assets/images/profileDark.png";
import profileLight from "../assets/images/profileLight.png";

const Home = () => {
  const { theme } = useUiStore();
  const { user } = useAuthStore();

  const isDark =
    theme === "dark" || theme === "synthwave" || theme === "halloween";

  // Dynamic Images based on Theme
  const editorImg = isDark ? editorDark : editorLight;
  const problemListImg = isDark ? problemListDark : problemListLight;
  const profileImg = isDark ? profileDark : profileLight;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-20 pb-32 text-center relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, staggerChildren: 0.1 },
            },
          }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
          >
            <Zap size={16} className="text-primary" />
            <span>The Next Generation Coding Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-base-content leading-tight"
          >
            Master Algorithms.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Elevate Your Career.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto leading-relaxed"
          >
            Practice coding interviews, compete with friends, and track your
            progress in a blazingly fast, deeply customizable development
            environment.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg rounded-xl px-8 shadow-lg shadow-primary/30 w-full sm:w-auto group"
                >
                  Start Coding Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  to="/problems"
                  className="btn btn-outline btn-lg rounded-xl px-8 w-full sm:w-auto"
                >
                  View Problems
                </Link>
              </>
            ) : (
              <Link
                to="/problems"
                className="btn btn-primary btn-lg rounded-xl px-8 shadow-lg shadow-primary/30 group w-full sm:w-auto"
              >
                Continue Practicing
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Hero Image Showcase */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden border border-base-300 shadow-2xl shadow-base-300/50 group"
        >
          {/* Subtle overlay gradient to make the image blend slightly */}
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/40 to-transparent pointer-events-none z-10"></div>
          <img
            src={editorImg}
            alt="CodeLab Editor Interface"
            className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-700"
          />
        </motion.div>
      </section>

      {/* 3. Feature Highlights Grid */}
      <section className="w-full bg-base-200/50 border-y border-base-300/50 py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-base-content">
              Everything you need to succeed
            </h2>
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
              We've obsessed over every detail of the platform so you can obsess
              over your algorithms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: Problem List */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="p-8 pb-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Layout size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Extensive Problem Library
                </h3>
                <p className="text-base-content/60 mb-8">
                  Browse hundreds of curated problems categorized by topic,
                  difficulty, and company tags. Track your solved status at a
                  glance.
                </p>
              </div>
              <div className="mt-auto p-8 bg-gradient-to-t from-base-200 to-transparent">
                <img
                  src={problemListImg}
                  alt="Problem List Interface"
                  className="rounded-t-xl shadow-lg border border-base-300/50 border-b-0 w-full h-auto object-cover"
                />
              </div>
            </motion.div>

            {/* Feature 2: Profile & Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="p-8 pb-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                  <BarChart size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
                <p className="text-base-content/60 mb-8">
                  Visualize your progress with gorgeous charts. Analyze your
                  acceptance rates, difficulty breakdowns, and recent submission
                  history.
                </p>
              </div>
              <div className="mt-auto p-8 bg-gradient-to-t from-base-200 to-transparent">
                <img
                  src={profileImg}
                  alt="User Profile Analytics"
                  className="rounded-t-xl shadow-lg border border-base-300/50 border-b-0 w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-32">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-base-100 border border-base-300/50 hover:bg-base-200/50 transition-colors"
          >
            <Server className="text-primary w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast Execution</h3>
            <p className="text-base-content/60">
              Our backend safely executes your code across multiple languages in
              isolated containers with zero lag.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-base-100 border border-base-300/50 hover:bg-base-200/50 transition-colors"
          >
            <Code2 className="text-secondary w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Monaco Editor Included</h3>
            <p className="text-base-content/60">
              Enjoy the same editing experience as VS Code, complete with syntax
              highlighting and auto-completion.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-base-100 border border-base-300/50 hover:bg-base-200/50 transition-colors"
          >
            <Shield className="text-accent w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
            <p className="text-base-content/60">
              Strict resource limits and robust test case evaluation ensure a
              fair and consistent grading experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="w-full max-w-4xl mx-auto px-4 pb-32 text-center">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 border border-base-300 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">
              Ready to start your journey?
            </h2>
            <p className="text-base-content/70 text-lg max-w-xl mx-auto">
              Join developers around the world who are leveling up their skills
              and landing their dream jobs.
            </p>
            {!user && (
              <div className="pt-4">
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg rounded-xl px-10 shadow-lg shadow-primary/30"
                >
                  Create a Free Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
