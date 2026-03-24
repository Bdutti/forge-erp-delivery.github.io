import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("sugestao");
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const criarFeedback = trpc.feedback.criar.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensagem.trim()) {
      toast.error("Por favor, escreva sua mensagem");
      return;
    }

    if (mensagem.trim().length < 10) {
      toast.error("A mensagem deve ter pelo menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      await criarFeedback.mutateAsync({
        tipo: tipo as "bug" | "sugestao" | "elogio" | "outro",
        mensagem: mensagem.trim(),
        email: email.trim() || undefined,
        pagina: window.location.pathname,
      });

      toast.success("Obrigado pelo seu feedback! 🙏");
      setMensagem("");
      setEmail("");
      setTipo("sugestao");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao enviar feedback. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brasa hover:bg-brasa/90 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center animate-glow-pulse"
        title="Enviar feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-s1 border-s3">
          <DialogHeader>
            <DialogTitle className="text-xl font-barlow-condensed">
              Envie seu Feedback
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Ajude-nos a melhorar o Forge ERP com suas sugestões, relatórios de bugs ou elogios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Feedback */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-sm font-semibold">
                Tipo de Feedback
              </Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="bg-s0 border-s3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-s1 border-s3">
                  <SelectItem value="sugestao">💡 Sugestão de Melhoria</SelectItem>
                  <SelectItem value="bug">🐛 Relatar Bug</SelectItem>
                  <SelectItem value="elogio">⭐ Elogio</SelectItem>
                  <SelectItem value="outro">❓ Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="mensagem" className="text-sm font-semibold">
                Mensagem *
              </Label>
              <Textarea
                id="mensagem"
                placeholder="Descreva sua sugestão, bug ou elogio aqui..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="bg-s0 border-s3 min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {mensagem.length}/1000 caracteres
              </p>
            </div>

            {/* Email (Opcional) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-s0 border-s3"
              />
              <p className="text-xs text-muted-foreground">
                Para que possamos responder seu feedback
              </p>
            </div>

            {/* Info */}
            <div className="bg-s0 border border-s3 rounded-lg p-3 text-xs text-muted-foreground">
              <p>
                <strong>Página atual:</strong> {window.location.pathname}
              </p>
              <p>
                <strong>Usuário:</strong> {user?.name || "Anônimo"}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-brasa hover:bg-brasa/90"
                disabled={isSubmitting || !mensagem.trim()}
              >
                {isSubmitting ? "Enviando..." : "Enviar Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
