import React, { useState } from "react";
import {
  statusCodes
} from "@react-native-google-signin/google-signin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// ─── Trạng thái UI (chưa có logic thật) ───────────────────────────────────────
type AuthState = "idle" | "loading" | "error" | "cancelled";

const MOCK_STATE: AuthState = "idle"; // đổi để xem các kịch bản

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(MOCK_STATE);

  const handleGooglePress = async () => {
    try {
      setAuthState("loading");
      await login();
    }catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Người dùng đã hủy đăng nhập");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Đang trong quá trình đăng nhập...");
      } else {
        console.error("Lỗi đăng nhập:", error);
      }
    }
  };


  return (
    <View style={[styles.root, { backgroundColor: "#0D0D14" }]}>
      <StatusBar barStyle="light-content" />

      {/* ── Orb decoration ── */}
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      {/* ── Logo / Brand ── */}
      <View style={styles.brandArea}>
        <View style={styles.logoBox}>
          {/* Google "G" placeholder */}
          <Text style={styles.logoLetter}>G</Text>
        </View>
        <Text style={styles.appName}>Google Connect</Text>
        <Text style={styles.tagline}>Kết nối tài khoản Google của bạn</Text>
      </View>

      {/* ── Card ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đăng nhập</Text>
        <Text style={styles.cardSub}>
          Dùng tài khoản Google để tiếp tục. Chúng tôi không lưu mật khẩu của bạn.
        </Text>

        {/* ── Nút Google ── */}
        <TouchableOpacity
          style={[styles.googleBtn, authState === "loading" && styles.googleBtnLoading]}
          onPress={handleGooglePress}
          activeOpacity={0.85}
          disabled={authState === "loading"}
        >
          {authState === "loading" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {/* Google icon inline SVG-ish via text fallback */}
              <View style={styles.googleIconWrap}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Tiếp tục với Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── Kịch bản: Lỗi ── */}
        {authState === "error" && (
          <View style={styles.alertBox}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Đăng nhập thất bại</Text>
              <Text style={styles.alertMsg}>
                Không thể kết nối với Google. Kiểm tra mạng và thử lại.
              </Text>
            </View>
          </View>
        )}

        {/* ── Kịch bản: Bị huỷ ── */}
        {authState === "cancelled" && (
          <View style={[styles.alertBox, styles.alertCancelled]}>
            <Text style={styles.alertIcon}>ℹ️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: "#93C5FD" }]}>Đã huỷ</Text>
              <Text style={styles.alertMsg}>Bạn đã đóng cửa sổ đăng nhập.</Text>
            </View>
          </View>
        )}

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Tuỳ chọn phụ ── */}
        <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.75}  onPress={() => router.replace("/profile")} >
          <Text style={styles.ghostBtnText}>Tiếp tục không cần đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <Text style={styles.footerLink}>Điều khoản sử dụng</Text> và{" "}
          <Text style={styles.footerLink}>Chính sách bảo mật</Text>.
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const BLUE = "#3B82F6";
// const BLUE_DARK = "#2563EB";
const GLASS_BG = "rgba(255,255,255,0.055)";
const GLASS_BORDER = "rgba(255,255,255,0.10)";

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },

  // Decorative orbs
  orbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  orbBottom: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(99,102,241,0.12)",
  },

  // Brand
  brandArea: { alignItems: "center", marginBottom: 36 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
  logoLetter: { fontSize: 32, fontWeight: "900", color: "#fff" },
  appName: { fontSize: 26, fontWeight: "800", color: "#F1F5F9", letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: "#64748B", marginTop: 6, letterSpacing: 0.1 },

  // Card
  card: {
    width: "100%",
    backgroundColor: GLASS_BG,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    padding: 28,
  },
  cardTitle: { fontSize: 22, fontWeight: "800", color: "#F1F5F9", marginBottom: 8 },
  cardSub: { fontSize: 13.5, color: "#64748B", lineHeight: 20, marginBottom: 24 },

  // Google button
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  googleBtnLoading: { opacity: 0.7 },
  googleIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIconText: { fontSize: 14, fontWeight: "900", color: "#fff" },
  googleBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.2 },

  // Alert
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(239,68,68,0.12)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  alertCancelled: {
    backgroundColor: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.2)",
  },
  alertIcon: { fontSize: 16, marginTop: 1 },
  alertTitle: { fontSize: 13.5, fontWeight: "700", color: "#FCA5A5", marginBottom: 2 },
  alertMsg: { fontSize: 12.5, color: "#94A3B8", lineHeight: 18 },

  // Divider
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 12, color: "#475569" },

  // Ghost button
  ghostBtn: {
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
  },
  ghostBtnText: { fontSize: 14.5, fontWeight: "600", color: "#94A3B8" },

  // Footer
  footer: { marginTop: 28, paddingHorizontal: 8 },
  footerText: { fontSize: 12, color: "#334155", textAlign: "center", lineHeight: 18 },
  footerLink: { color: "#3B82F6", fontWeight: "600" },
});