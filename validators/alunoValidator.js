import { body, param, validationResult } from "express-validator";

export const validateAlunoCreation = [
  body("id")
    .exists()
    .withMessage("id é obrigatório")
    .isInt({ min: 1 })
    .withMessage("id deve ser inteiro positivo"),
  body("nome")
    .exists()
    .withMessage("nome é obrigatório")
    .isString()
    .withMessage("nome deve ser string")
    .isLength({ min: 3 })
    .withMessage("nome deve ter ao menos 3 caracteres"),
  body("ra")
    .exists()
    .withMessage("ra é obrigatório")
    .isString()
    .withMessage("ra deve ser string")
    .isLength({ min: 3 })
    .withMessage("ra inválido"),
  body("nota1")
    .exists()
    .withMessage("nota1 é obrigatória")
    .isFloat({ min: 0, max: 10 })
    .withMessage("nota1 deve estar entre 0 e 10"),
  body("nota2")
    .exists()
    .withMessage("nota2 é obrigatória")
    .isFloat({ min: 0, max: 10 })
    .withMessage("nota2 deve estar entre 0 e 10"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateAlunoUpdate = [
  param("id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id do parâmetro deve ser inteiro positivo"),
  body("nome")
    .optional()
    .isString()
    .withMessage("nome deve ser string")
    .isLength({ min: 3 })
    .withMessage("nome deve ter ao menos 3 caracteres"),
  body("ra").optional().isString().withMessage("ra deve ser string"),
  body("nota1")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("nota1 deve estar entre 0 e 10"),
  body("nota2")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("nota2 deve estar entre 0 e 10"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
