"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@/zod/schemas/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormAlert from "@/components/FormAlert";
import { useState, useTransition } from "react";
import handleSignUp from "@/server-actions/handleSignUp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      role: undefined,
      email: "",
      fullName: "",
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof SignUpSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      handleSignUp(data).then((result) => {
        setError(result.error ?? null);
        setSuccess(result.success ?? null);
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex h-screen items-center justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Card className="w-full max-w-sm space-y-1">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role">Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                      required
                    >
                      <FormControl>
                        <SelectTrigger id="role" name="role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("role") === "parent" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="marcoshernanz@example.com"
                          autoComplete="off"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fullName">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Marcos Hernanz"
                        autoComplete="off"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        id="username"
                        name="username"
                        type="text"
                        placeholder="marcoshernanz123"
                        autoComplete="off"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="Password">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="off"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              Sign Up
            </Button>

            {error && <FormAlert variant="destructive" message={error} />}
            {success && <FormAlert variant="success" message={success} />}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}